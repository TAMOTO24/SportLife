import React, { useState, useEffect, useRef } from "react";
import { Progress, Divider, Button, message } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import Loading from "../addLoadingElement/index";
import { formatTime, socket, timeString } from "../../function";
import PeerCamera from "../addCameraComponent/index";
import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const WorkoutProgressPage = () => {
  const [uniqueUIDV4Id] = useState(useParams().roomId);
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [workoutStatuses, setWorkoutStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(dayjs().unix());

  const [currentWorkout, setCurrentWorkout] = useState(
    location.state?.currentWorkout || {}
  );
  const [user, setUser] = useState(undefined);
  const ownerRef = useRef(null);
  const [owner, setOwner] = useState(null);
  const [serverData, setServerData] = useState(false);
  const [userCount, setUserCount] = useState(0);

  const fillAllData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/room/${uniqueUIDV4Id}`);
      const roomData = response.data;

      if (
        !roomData.data.exercises ||
        !roomData.data.status ||
        !roomData.data.startTime
      )
        return;

      setExercises(roomData.data.exercises);
      setWorkoutStatuses(roomData.data.status);
      setCurrentWorkout(roomData.data.currentWorkout);
      setData(roomData.data);
      setStartTime(roomData.data.startTime);
    } catch (error) {
      console.error("Error loading room data", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      !currentWorkout ||
      !ownerRef.current ||
      workoutStatuses.length > 0 ||
      !exercises
    )
      return;
    setIsLoading(true);
    axios
      .get(`/exercises/${currentWorkout?.exercises_id}`)
      .then((response) => {
        setExercises(response.data.exercises);
        setWorkoutStatuses(
          response.data.exercises.map((_, index) =>
            index === 0 ? "WorkingOn" : "Waiting"
          )
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentWorkout, user, owner]);

  useEffect(() => {
    const init = async () => {
      await fillAllData();
      setServerData(true);
    };

    if (ownerRef.current) init();
  }, [owner, uniqueUIDV4Id]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/currentuserdata")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => console.error("Auth error", error))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    socket.emit("getRoomOwner", { roomId: uniqueUIDV4Id });

    socket.on("connect", () => {
      console.log("✅ Connected to socket.io server:", socket.id);
      socket.emit("joinRoom", { roomId: uniqueUIDV4Id, userId: user._id });
    });

    socket.on("receiveData", (data) => {
      setData(data);
      if (!ownerRef.current) {
        setExercises(data.exercises);
        setWorkoutStatuses(data.status);
        setCurrentWorkout(data.currentWorkout);
      }
    });

    socket.on("roomOwner", (ownerId) => {
      const isOwner = ownerId.toString() === user._id;
      ownerRef.current = isOwner;
      setOwner(isOwner);
    });

    socket.on("room-user-count", (count) => {
      setUserCount(count);
    });

    socket.on("backToRoom", () => {
      if (socket.connected) {
        message.warning("Перенаправлено в кімнату");
        navigate(`/workoutroom/${uniqueUIDV4Id}`, { replace: true });
      }
    });

    socket.on("roomClosed", () => {
      if (socket.connected) {
        message.warning("Кімнату закрито — творець вийшов");
        navigate("/", { replace: true });
      }
    });

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect");
      socket.off("receiveData");
      socket.off("roomOwner");
      socket.off("backToRoom");
      socket.off("roomClosed");
      socket.disconnect();
      // This code runs when the component is unmounted due to a route change
      if (ownerRef.current) {
        socket.emit("hostChangedPage", { roomId: uniqueUIDV4Id });
      }
    };
  }, [user, navigate, uniqueUIDV4Id]);

  useEffect(() => {
    if (!socket.connected) return;

    if (
      user &&
      ownerRef.current &&
      Array.isArray(exercises) &&
      Array.isArray(workoutStatuses) &&
      serverData
    ) {
      socket.emit("updateData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
        data: exercises,
        currentWorkout: currentWorkout,
        startTime: startTime,
        finalTimeResult: "",
        status: workoutStatuses,
      });
    }
  }, [user, exercises, workoutStatuses, owner, currentWorkout, serverData]);

  const handleNextExercise = (index) => {
    if (index >= exercises.length) {
      return;
    }
    setCurrentIndex(currentIndex + 1);

    setWorkoutStatuses((prevStatuses) =>
      prevStatuses.map((status, i) =>
        i === index ? "Finished" : i === index + 1 ? "WorkingOn" : status
      )
    );
  };
  const endTraining = () => {
    if (socket.connected) {
      socket.emit("updateData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
        data: exercises,
        startTime: data?.startTime,
        finalTimeResult: formatTime(dayjs().unix() - data?.startTime),
      });

      const resultData = {
        startTime: data?.startTime,
        trainingTime: dayjs().unix() - data?.startTime,
        data: exercises,
        userId: user._id,
        roomId: uniqueUIDV4Id,
        exerciseCount: exercises.length,
        workout: currentWorkout,
      };
      if (ownerRef.current) {
        socket.emit("updateUsersStatistic", {
          userId: user?._id,
          data: resultData,
        });
      }
      navigate(ownerRef.current ? `/workoutroom/${uniqueUIDV4Id}/result` : "", {
        replace: true,
        state: { result: resultData },
      });
      socket.emit("disconnectData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
      });

      socket.disconnect();
    } else {
      console.error("❌ Socket is not connected");
    }
  };

  return !exercises ||
    exercises.length === 0 ||
    !workoutStatuses ||
    workoutStatuses.length === 0 ||
    loading ||
    ownerRef.current == null ? (
    <Loading />
  ) : (
    <div className="progress-page">
      <PeerCamera
        user={user}
        isHost={ownerRef.current}
        roomId={uniqueUIDV4Id}
      />
      <div className="progress-nav-block">
        <div className="progressBlock">
          <img src="/img-pack/logo/logo_black2.png" alt="logo" />
          <h1>{currentWorkout?.title}</h1>
          <Progress
            percent={
              ((workoutStatuses.lastIndexOf("Finished") + 1) /
                exercises.length) *
              100
            }
            percentPosition={{ align: "end", type: "inner" }}
            style={{ width: 0 }}
            size={[300, 20]}
            strokeColor="#001342"
          />
        </div>
        <hr />
      </div>

      <div className="progress-workout-block">
        {exercises.map((item) => (
          <div
            key={item?.index}
            className={`progress-workout-item ${
              workoutStatuses[item?.index] !== "WorkingOn" ? "bloked" : ""
            }`}
          >
            <img
              src={
                item?.img_tip_url ||
                "/img-pack/trainers/full-shot-woman-with-laptop.jpg"
              }
              lazy
              alt="trainingImg"
            />
            <div className="item-content">
              <h2 style={{ marginBottom: 8, color: "#222" }}>{item.name}</h2>
              <Divider style={{ background: "#ddd" }} />

              <h4 style={{ color: "#222" }}>Muscle Engagement</h4>
              {Object.entries(item.muscleGroups).map(([muscle, percent]) => (
                <div
                  key={muscle}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#555" }}>{muscle}</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: 120,
                    }}
                  >
                    <span>{percent}%</span>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                </div>
              ))}

              <Divider style={{ background: "#ddd" }} />

              <h4 style={{ color: "#222" }}>Description</h4>
              <p style={{ color: "#555" }}>{item.description}</p>

              <Divider style={{ background: "#ddd" }} />

              <h4 style={{ color: "#222" }}>Workout Details</h4>
              <div
                style={{
                  color: "#555",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>Sets:</strong>
                  <p>{item.sets}</p>
                </div>
                <div>
                  <strong>Reps:</strong>
                  <p>{item.reps}</p>
                </div>
                <div>
                  <strong>Rest:</strong>
                  <p>{item.restTime}</p>
                </div>
              </div>

              <Divider style={{ background: "#ddd" }} />

              <h4 style={{ color: "#222" }}>Technique</h4>
              <ul style={{ color: "#555" }}>
                {item.technique.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>

              <Divider style={{ background: "#ddd" }} />

              <h4 style={{ color: "#222" }}>Tips</h4>
              <ul style={{ color: "#555" }}>
                {item.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>

              <Divider style={{ background: "#ddd" }} />

              <div className="progress-block">
                {owner && (
                  <Button
                    size="large"
                    onClick={() => handleNextExercise(item.index)}
                    disabled={
                      workoutStatuses[item.index] !== "WorkingOn" ? true : false
                    }
                  >
                    Next exercise
                  </Button>
                )}
                {workoutStatuses[item.index] && (
                  <img
                    src={`/img-pack/icons/${
                      {
                        Waiting: "clock.png",
                        Finished: "success.png",
                        WorkingOn: "process.png",
                      }[workoutStatuses[item.index]]
                    }`}
                    id="icon"
                    alt="status"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "5vh 15%",
          }}
        >
          {owner && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={endTraining}
              disabled={
                !workoutStatuses.every((status) => status === "Finished")
              }
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#389e0d",
                color: "white",
                fontWeight: "bold",
                width: "100%",
                fontSize: "16px",
                padding: "8px 20px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                opacity: !workoutStatuses.every(
                  (status) => status === "Finished"
                )
                  ? 0.2
                  : 1,
                cursor: !workoutStatuses.every(
                  (status) => status === "Finished"
                )
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              End Training
            </Button>
          )}
        </div>
      </div>
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          display: "flex",
          left: 0,
          width: "100%",
          background: "#f8f8f8",
          alignItems: "center",
          padding: "10px",
          borderTop: "1px solid #ddd",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          Start time:
          {timeString(data?.startTime)}
        </div>
        <div>
          Sets: {currentIndex} / {exercises.length}
        </div>
        <div>
          time: {Math.abs(dayjs(data?.startTime).diff(dayjs(), "seconds"))}
        </div>
        <div>© 2025 Sportlife. All rights reserved.</div>
        <div><EyeOutlined /> {" "} {userCount}</div>
        {owner && (<div>
          Live right now!
          <img
            src="/img-pack/icons/Red_circle.gif"
            alt=""
            style={{ width: "30px", height: "30px" }}
          />
        </div>)}
      </footer>
    </div>
  );
};

export default WorkoutProgressPage;
