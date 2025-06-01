import React, { useState, useEffect, useRef } from "react";
import { Progress, Divider, Button, message } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import Loading from "../addLoadingElement/index";
import Cookies from "js-cookie";
import { formatTime, socket, peer, timeString } from "../../function";
import PeerCamera from "../addCameraComponent/index";

const WorkoutProgressPage = () => {
  // const [time, setTime] = useState(0);
  const [uniqueUIDV4Id] = useState(useParams().roomId);
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [workoutStatuses, setWorkoutStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(Date.now());
  // const { currentWorkout } = location.state || {};
  const [currentWorkout, setCurrentWorkout] = useState(
    location.state?.currentWorkout || {}
  );
  const [user, setUser] = useState(undefined);
  const ownerRef = useRef(null);
  const [owner, setOwner] = useState(null);

  const fillAllData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/room/${uniqueUIDV4Id}`);
      const roomData = response.data;

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
    if (ownerRef.current) {
      fillAllData();
    }
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
    // ! if workoutStatuses may be an undefined there will be an error
    if (!currentWorkout || ownerRef.current === false || workoutStatuses.length > 0) return;
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
  }, [currentWorkout, user]);

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

    socket.on("roomClosed", () => {
      message.error("Кімнату закрито — творець вийшов");
      // Cookies.remove("roomId");
      navigate("/", { replace: true });
    });

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect");
      socket.off("receiveData");
      socket.off("roomOwner");
      socket.disconnect();
    };
  }, [user, navigate, uniqueUIDV4Id]);

  useEffect(() => {
    if (!socket.connected) return;

    if (
      user &&
      ownerRef.current &&
      Array.isArray(exercises) &&
      exercises.length > 0 &&
      Array.isArray(workoutStatuses) &&
      workoutStatuses.length > 0
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
  }, [user, exercises, workoutStatuses, owner, currentWorkout, uniqueUIDV4Id]);

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
        finalTimeResult: formatTime(Date.now() - data?.startTime),
      });

      const resultData = {
        startTime: data?.startTime,
        trainingTime: Date.now() - data?.startTime,
        data: exercises,
        userId: user._id,
        roomId: uniqueUIDV4Id,
        exerciseCount: exercises.length,
        workout: currentWorkout,
      };
      console.log(ownerRef.current, user._id);
      if (ownerRef.current) {
        console.log("send update statistic");
        socket.emit("updateUsersStatistic", {
          userId: user?._id,
          data: resultData,
        });
      }
      navigate(
        ownerRef.current ? `/workoutroom/${uniqueUIDV4Id}/result` : "/",
        { replace: true, state: { result: resultData } }
      );
      // Cookies.remove("roomId");
      socket.emit("disconnectData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
      });

      console.log("Socket disconnected");
      socket.disconnect();
    } else {
      console.error("❌ Socket is not connected");
    }
  };

  // if (error) {
  //   return (
  //     <div>
  //       <h1>Помилка завантаження даних</h1>
  //       <p>Спробуйте перезавантажити сторінку.</p>
  //     </div>
  //   );
  // }

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
          {/* <Progress
            percentPosition={{ align: 'start', type: 'outer' }}
            percent={((workoutStatuses.lastIndexOf('Finished') + 1) / exercises.length) * 100}
            size={100}
          /> */}
          <Progress
            percent={
              ((workoutStatuses.lastIndexOf("Finished") + 1) /
                exercises.length) *
              100
            }
            percentPosition={{ align: "end", type: "inner" }}
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
              src="/img-pack/trainers/full-shot-woman-with-laptop.jpg"
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

              {/* <h4 style={{ color: "#222" }}>Equipment</h4>
              <ul style={{ color: "#555" }}>
                {item.equipment.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul> */}
              {/* <Divider style={{ background: "#ddd" }} /> */}
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
        {owner && (
          <Button
            onClick={endTraining}
            disabled={!workoutStatuses.every((status) => status === "Finished")}
          >
            End training
          </Button>
        )}
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
        {/* <Statistic value={formatTime(time)} /> */}
        <div>
          Start time:
          {timeString(data?.startTime)}
        </div>
        <div>
          Sets: {currentIndex} / {exercises.length}
        </div>
        <div>© 2025 Sportlife. All rights reserved.</div>
        <div>
          Live right now!
          <img
            src="/img-pack/icons/Red_circle.gif"
            alt=""
            style={{ width: "30px", height: "30px" }}
          />
        </div>
      </footer>
    </div>
  );
};

export default WorkoutProgressPage;
