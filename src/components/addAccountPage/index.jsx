import React, { useState, useEffect } from "react";
import "./style.css";
import { Form, message } from "antd";
import axios from "axios";
import Loading from "../addLoadingElement";
import AccountInfoSection from "../addAccountInfoSection";
import WorkoutStatisticSection from "../addWorkoutStatisticSection";

const AccountPage = () => {
  const [form] = Form.useForm();
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("Account info");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/currentuserdata");
        console.log("User data:", response.data.user);
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
            img loading="lazy"
          />
        </a>
        {[
          { img: "/img-pack/icons/profile-user.png", label: "Інформація аккаунту" },
          {
            img: "/img-pack/icons/dumbbell.png",
            label: "Поточний план тренувань",
          },
          {
            img: "/img-pack/icons/statistical.png",
            label: "Статистика тренувань",
          },
          { img: "/img-pack/icons/gym-station.png", label: "Конфігурація ролі" },
          { img: "/img-pack/icons/fitness.png", label: "Улюблені тренування" },
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
          id="Інформація аккаунту"
          className={selected === "Інформація аккаунту" ? "" : "hidePage"}
        >
          <AccountInfoSection />
        </div>
        <div
          id="Статистика тренувань"
          className={selected === "Статистика тренувань" ? "" : "hidePage"}
        >
          <WorkoutStatisticSection user={user}/>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
