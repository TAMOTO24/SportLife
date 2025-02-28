import React, { useState } from "react";
import "./style.css";
import { Outlet, Link, useNavigate } from "react-router-dom";

const WorkoutPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const handleClick = (index) => {
    setActiveIndex(index);
  };
  const navigateToWorkoutPage = (id) => {
    navigate("/");
  };

  return (
    <div id="workoutpage">
      <div className="navWorkout">
        {[
          { to: "", label: "Running", src: "./img-pack/running.png" },
          { to: "", label: "Stretching", src: "./img-pack/stretch.png" },
          { to: "", label: "Yoga", src: "./img-pack/yoga.png" },
          { to: "", label: "Strength", src: "./img-pack/strength.png" },
          { to: "", label: "Cardio", src: "./img-pack/cardiology.png" },
        ].map((item) => (
          <a
            className={`navElements ${
              activeIndex === item.label ? "activeEl" : ""
            }`}
            onClick={() => {
              handleClick(item.label);
            }}
            key={item.label}
          >
            <img src={item.src} alt={item.label} />
            <div>{item.label}</div>
          </a>
        ))}
      </div>
      <div className="pageBackground">
        <img src="/img-pack/strength-workout.gif" alt="" />
      </div>
      <div className="workoutBodyComponent">
        <div className="upperWorkoutTable">
          <p>Try out workout plans</p>
        </div>

        <div className="workoutTable">
          {[
            {
              to: "",
              title: "TEST",
              description: "This description used for test",
              trainer: "Test Trainer",
              type: "Strength",
              src: "./img-pack/page1.jpg",
            },
            {
              to: "",
              title: "TEST",
              description: "This description used for test",
              trainer: "Test Trainer",
              type: "Strength",
              src: "./img-pack/page1.jpg",
            },
            {
              to: "",
              title: "TEST",
              description: "This description used for test",
              trainer: "Test Trainer",
              type: "Strength",
              src: "./img-pack/page1.jpg",
            },
            {
              to: "",
              title: "TEST",
              description: "This description used for test",
              trainer: "Test Trainer",
              type: "Strength",
              src: "./img-pack/page1.jpg",
            },
            {
              to: "",
              title: "TEST",
              description: "This description used for test",
              trainer: "Test Trainer",
              type: "Strength",
              src: "./img-pack/page1.jpg",
            },
          ].map((item) => (
            <a className="workoutCard" onClick={() => {navigateToWorkoutPage(item.id)}} key={item.label}>
              <img src={item.src} alt={item.title} />
              <div className="workoutText">
                <div className="workoutTitle">{item.title}</div>
                <div className="workoutDesc">{item.description}</div>
                <div className="workoutTrainer">
                  {item.trainer} #{item.type}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
