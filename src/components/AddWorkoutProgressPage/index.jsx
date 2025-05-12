import React, { useState, useEffect, useRef } from "react";
import { Progress, Divider, Button, Statistic } from "antd";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";
import Loading from "../addLoadingElement/index";
import { formatTime, socket, timeString } from "../../function";

const WorkoutProgressPage = () => {
  // const [time, setTime] = useState(0);

  const [uniqueUIDV4Id] = useState(useParams().roomId);
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [workoutStatuses, setWorkoutStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const { currentWorkout } = location.state || {};
  const [user, setUser] = useState(undefined);
  const ownerRef = useRef(null);
  const [owner, setOwner] = useState(null);

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
    if (!currentWorkout) return;
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
        console.log("in it");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentWorkout]);

  // useEffect(() => {
  //   if (!loading) {
  //     const interval = setInterval(() => {
  //       setTime((prev) => prev + 1);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [loading]);

  useEffect(() => {
    if (currentIndex >= exercises.length) {
      // TODO handle workout finisher, maybe create new page with info about passed workout
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!user) return;
    
    socket.emit("getRoomOwner", { roomId: uniqueUIDV4Id });

    socket.on("connect",() => {
      console.log("✅ Connecteditch to socket.io server:", socket.id);
      console.log("daaa ti vizval ego");
      socket.emit("joinRoom", { roomId: uniqueUIDV4Id, userId: user._id });
      
    });
    // ! ERROR When user update page, clients stop reciving data
    socket.on("receiveData", (data) => {
      console.log("didn't in")
      if (!ownerRef.current) {
        setExercises(data.exercises);
        setWorkoutStatuses(data.status);
      }
    });

    socket.on("roomOwner", (ownerId) => {
      const isOwner = ownerId.toString() === user._id;
      ownerRef.current = isOwner;
      setOwner(isOwner);
    });

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect");
      socket.off("receiveData");
      socket.off("roomOwner");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket.connected) return;

    if (
      user &&
      ownerRef.current &&
      exercises.length &&
      workoutStatuses.length
    ) {
      socket.emit("updateData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
        data: exercises,
        startTime: Date.now(),
        finalTimeResult: "",
        status: workoutStatuses,
      });
    }
  }, [user, exercises, workoutStatuses, owner ]);

  const handleNextExercise = (index) => { // ! Make this function work properly
    if (index >= exercises.length) {
      return;
    }
    setCurrentIndex(index);
    setWorkoutStatuses((prevStatuses) =>
      prevStatuses.map((status, i) =>
        i === index - 1 ? "Finished" : i === index ? "WorkingOn" : status
      )
    );
  };
  // ! This function is important too
  // const disconnectSocket = () => {
  //   if (socket.connected) {
  //     socket.emit("updateData", {
  //       roomId: uniqueUIDV4Id,
  //       userId: user._id,
  //       data: exercises,
  //       startTime: data?.startTime,
  //       finalTimeResult: formatTime(Date.now() - data?.startTime),
  //     });
  //   } else {
  //     console.error("❌ Socket is not connected");
  //   }
  // };


  console.log(exercises);
  console.log(workoutStatuses);
  console.log(loading);
  return !exercises ||
    exercises.length === 0 ||
    !workoutStatuses ||
    workoutStatuses.length === 0 ||
    loading ? (
    <Loading />
  ) : (
    <div className="progress-page">
      <div className="progress-nav-block">
        <div className="progressBlock">
          <img src="/img-pack/logo/logo_black2.png" alt="logo" />
          <h1>{currentWorkout?.title}</h1>
          <Progress
            steps={10}
            percent={(currentIndex / exercises.length) * 100}
            size={90}
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
                <Button
                  size="large"
                  onClick={() => handleNextExercise(item.index)}
                >
                  Next exercise
                </Button>
                {workoutStatuses[item.id - 1] === "Waiting" && (
                  <img
                    src="./img-pack/icons/clock.png"
                    id="icon"
                    alt="in progress"
                  />
                )}
                {workoutStatuses[item.id - 1] === "Finished" && (
                  <img src="./img-pack/icons/success.png" id="icon" alt="" />
                )}
                {workoutStatuses[item.id - 1] === "WorkingOn" && (
                  <img src="./img-pack/icons/process.png" id="icon" alt="" />
                )}
              </div>
            </div>
          </div>
        ))}
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
      </footer>
    </div>
  );
};

export default WorkoutProgressPage;
