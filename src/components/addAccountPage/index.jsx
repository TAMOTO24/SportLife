import React, { useState, useEffect } from "react";
import "./style.css";
import {
  Form,
  message,
} from "antd";
import axios from "axios";
import Loading from "../addLoadingElement";
import AccountInfoSection from "../addAccountInfoSection"
import WorkoutStatisticSection from "../addWorkoutStatisticSection"

const AccountPage = () => {
  const [form] = Form.useForm();
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("Account info");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/protected-route");
        setUser(response.data.user);
      } catch (error) {
        message.error("Error retrieving user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="accountPage">
      <div className={`accountNavBlock ${active ? "activeBlock" : ""}`}>
        <a className="menuBlock" onClick={() => setActive(!active)}>
          <img
            src={
              active
                ? "./img-pack/icons/close.png"
                : "./img-pack/icons/menu.png"
            }
            id="menu"
          />
        </a>
        {[
          { img: "./img-pack/icons/profile-user.png", label: "Account info" },
          {
            img: "./img-pack/icons/dumbbell.png",
            label: "Current workout plan",
          },
          {
            img: "./img-pack/icons/statistical.png",
            label: "Workout statistic",
          },
          { img: "./img-pack/icons/gym-station.png", label: "Current Trainer" },
          { img: "./img-pack/icons/fitness.png", label: "Favorite workouts" },
        ].map((item, index) => (
          <a
            key={index}
            className={`elementBlock ${
              selected === item.label ? "selected" : ""
            }`}
            onClick={() => setSelected(item.label)}
          >
            <img loading="lazy" src={item.img} alt={item.label} />
            <div className={active ? "activeButton" : ""}>{item.label}</div>
          </a>
        ))}
      </div>
      <div id="pages">
        {/* <h1>{selected}</h1> */}
        <div
          id="Account info"
          className={selected === "Account info" ? "" : "hidePage"}
        >
          <AccountInfoSection user={user}/>
        </div>
        <div
          id="Workout statistic"
          className={selected === "Workout statistic" ? "" : "hidePage"}
        >
          <WorkoutStatisticSection />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
