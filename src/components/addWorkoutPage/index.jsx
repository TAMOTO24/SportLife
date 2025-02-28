import React, { useState, useEffect } from "react";
import "./style.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Collapse, Typography } from 'antd';
import faqs from "./faqs.js"
import TrainerCardElement from "../addTrainerCardElement/index"

const { Panel } = Collapse;
const { Title } = Typography;

const WorkoutPage = () => {
  const [activeIndex, setActiveIndex] = useState("Strength");
  const [workouts, setWorkouts] = useState([])
  const navigate = useNavigate();
  const handleClick = (index) => {
    setActiveIndex(index);
  };
  const navigateToWorkoutPage = (item) => {
    navigate("/classpage", { state: { workout: item } });
  };
  useEffect(() => {
    axios
      .post("/api/workouts", { type: activeIndex })
      .then((response) => {setWorkouts(response.data)})
      .catch((error) => console.error(error));
  }, [workouts]);


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
          {workouts.map((item) => (
            <a className="workoutCard" onClick={() => {navigateToWorkoutPage(item)}} key={item.label}>
              <img src={item.img[0]} alt={item.title} />
              <div className="workoutText">
                <div className="workoutTitle">{item.title}</div>
                <div className="workoutDesc">{item.description}</div>
                <div className="workoutTrainer">
                  <div>{item.trainer}</div> 
                  {item.type.map((tag) => (<div>#{tag}</div>))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <TrainerCardElement />
      <hr />
      <div className="questionsSection">
            <Title level={1} style={{ padding: '10px', alignItems: "center" }}>
                FAQs about Sports
            </Title>
            <Collapse accordion>
                {faqs.map((faq, index) => (
                    <Panel header={faq.question} className="quesiton" key={index}>
                        <p className="questionAnswer">{faq.answer}</p>
                    </Panel>
                ))}
            </Collapse>
        </div>
    </div>
  );
};

export default WorkoutPage;
