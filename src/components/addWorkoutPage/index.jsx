import React, { useState, useEffect, useCallback } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Typography, Collapse } from "antd";
import faqs from "./faqs.js";
import TrainerCardElement from "../addTrainerCardElement/index";
import Loading from "../addLoadingElement";

const { Panel } = Collapse;
const { Title } = Typography;

const WorkoutPage = () => {
  const [activeIndex, setActiveIndex] = useState("Strength");
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [cachedWorkouts, setCachedWorkouts] = useState({});
  const navigate = useNavigate();
  const labels = [
    { en: "Running", ua: "Біг" },
    { en: "Stretch", ua: "Розтяжка" },
    { en: "Yoga", ua: "Йога" },
    { en: "Strength", ua: "Сила" },
    { en: "Cardio", ua: "Кардіо" },
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const navigateToWorkoutPage = (item) => {
    navigate(`/classpage/${item?._id}`, { state: { workout: item } });
  };

  const fetchWorkouts = useCallback(
    async (index) => {
      if (cachedWorkouts[index]) {
        setWorkouts(cachedWorkouts[index]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `/api/workouts/${encodeURIComponent(index)}`
        );
        setWorkouts(response.data);
        setCachedWorkouts((prev) => ({
          ...prev,
          [index]: response.data,
        }));
      } catch (error) {
        message.error(error);
      } finally {
        setLoading(false);
      }
    },
    [cachedWorkouts]
  );

  useEffect(() => {
    fetchWorkouts(activeIndex);
  }, [activeIndex, fetchWorkouts]);

  return (
    <div id="workoutpage">
      <div className="navWorkout">
        {labels.map(({ en, ua }) => (
          <a
            key={en}
            className={`navElements ${activeIndex === en ? "activeEl" : ""}`}
            onClick={() => handleClick(en)}
          >
            <img
              loading="lazy"
              src={`./img-pack/icons/${en.toLowerCase()}.png`}
              alt={ua}
            />
            <div>{ua}</div>
          </a>
        ))}
      </div>

      <div className="pageBackground">
        <img loading="lazy" src="/img-pack/strength-workout.gif" alt="" />
      </div>

      <div className="workoutBodyComponent">
        <div className="upperWorkoutTable">
          <p>Спробуй плани тренувань!</p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="workoutTable">
            {workouts.map((item) => (
              <a
                className="workoutCard"
                onClick={() => navigateToWorkoutPage(item)}
                key={item.label}
              >
                <img src={item.img[0]} loading="lazy" alt={item.title} />
                <div className="workoutText">
                  <div className="workoutTitle">{item.title}</div>
                  <div className="workoutDesc">{item.description}</div>
                  <div className="workoutTrainer">
                    <a style={{ textDecoration: "underline" }}>
                      {item.trainer}
                    </a>
                    <div className="tag-block">
                      {item.type.map((tag) => (
                        <div id="workout-id" key={tag}>
                          #{tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <TrainerCardElement />
      <hr />

      <div className="questionsSection">
        <Title level={1} style={{ padding: "10px", alignItems: "center" }}>
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
