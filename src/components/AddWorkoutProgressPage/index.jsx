import React, { useState } from "react";
import { Progress, Divider, Button } from "antd";
import "./style.css";

// ! EXAMPLE VARIABLE
const workouts = [
  {
    id: 1,
    name: "Barbell Squats",
    muscleGroups: {
      quadriceps: 60,
      glutes: 25,
      hamstrings: 15,
    },
    description:
      "A fundamental strength exercise for building leg power and mass.",
    technique: [
      "Stand upright with your feet shoulder-width apart.",
      "Place the barbell on your traps and hold it securely.",
      "Lower yourself by bending your knees until your thighs are parallel to the floor.",
      "Push back up to the starting position.",
    ],
    tips: [
      "Keep your back straight and avoid rounding your spine.",
      "Make sure your knees do not go past your toes.",
    ],
    sets: 4,
    reps: 8,
    restTime: "90 seconds",
    equipment: ["Barbell", "Squat Rack"],
  },
  {
    id: 2,
    name: "Leg Press",
    muscleGroups: {
      quadriceps: 50,
      glutes: 30,
      hamstrings: 20,
    },
    description: "An excellent exercise to target the quadriceps and glutes.",
    technique: [
      "Sit in the leg press machine and place your feet on the platform.",
      "Slowly lower the platform by bending your knees to a 90-degree angle.",
      "Push the platform back up without locking your knees.",
    ],
    tips: [
      "Keep your lower back pressed against the seat.",
      "Control the movement and avoid sudden jerks.",
    ],
    sets: 4,
    reps: 12,
    restTime: "60 seconds",
    equipment: ["Leg Press Machine"],
  },
  {
    id: 3,
    name: "Romanian Deadlifts",
    muscleGroups: {
      hamstrings: 60,
      glutes: 30,
      lowerBack: 10,
    },
    description: "A great exercise for developing the hamstrings and glutes.",
    technique: [
      "Hold dumbbells, stand upright with a slight bend in your knees.",
      "Lower the dumbbells by hinging at your hips, keeping your back straight.",
      "Return to the starting position by squeezing your glutes.",
    ],
    tips: [
      "Do not round your back, keep it neutral.",
      "Move smoothly without sudden jerks.",
    ],
    sets: 3,
    reps: 10,
    restTime: "60 seconds",
    equipment: ["Dumbbells"],
  },
  {
    id: 4,
    name: "Leg Extensions",
    muscleGroups: {
      quadriceps: 90,
      hamstrings: 10,
    },
    description: "An isolation exercise to focus on the quadriceps.",
    technique: [
      "Sit in the leg extension machine and place your feet under the padded bar.",
      "Extend your legs fully, contracting your quadriceps.",
      "Slowly return to the starting position.",
    ],
    tips: [
      "Avoid using too much weight—focus on proper form.",
      "Keep your back firmly against the seat.",
    ],
    sets: 3,
    reps: 15,
    restTime: "45 seconds",
    equipment: ["Leg Extension Machine"],
  },
];

const WorkoutProgressPage = () => {
  const [workoutStatuses, setWorkoutStatuses] = useState(
    workouts.map((_, index) => (index === 0 ? "WorkingOn" : "Waiting"))
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextExercise = (index) => {
    setCurrentIndex(index);
    setWorkoutStatuses((prevStatuses) =>
      prevStatuses.map((status, i) =>
        i === index - 1 ? "Finished" : i === index ? "WorkingOn" : status
      )
    );
  };
  return (
    <div className="progress-page">
      <div className="progress-nav-block">
        <div className="progressBlock">
          <img src="./img-pack/logo/logo_black2.png" alt="logo" />
          <h1>Workout name</h1>
          <Progress
            steps={10}
            percent={(currentIndex / workouts.length) * 100}
            size={90}
          />
        </div>
        <hr />
      </div>

      <div className="progress-workout-block">
        {workouts.map((item) => (
          <div
            key={item.id}
            className={`progress-workout-item ${
              workoutStatuses[item?.id - 1] !== "WorkingOn" ? "bloked" : ""
            }`}
          >
            <img
              src="./img-pack/trainers/full-shot-woman-with-laptop.jpg"
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
                <Button
                  size="large"
                  onClick={() => handleNextExercise(item.id)}
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
          left: 0,
          width: "100%",
          background: "#f8f8f8",
          textAlign: "center",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        © 2025 Sportlife. All rights reserved.
      </footer>
    </div>
  );
};

export default WorkoutProgressPage;
