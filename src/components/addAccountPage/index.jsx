import React, { useState, useEffect } from "react";
import "./style.css";
import { Form, message, Spin } from "antd";
import axios from "axios";
import Loading from "../addLoadingElement";
import AccountInfoSection from "../addAccountInfoSection";
import WorkoutStatisticSection from "../addWorkoutStatisticSection";
import RoleConfigurationSection from "../addRoleConfigurationSectionPage";
import BookmarkList from "../addBookMarkSection";
import PersonalTrainer from "../addPersonalTrainerSection";

const AccountPage = () => {
  const [form] = Form.useForm();
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("Інформація аккаунту");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [bookmarks, setBookMarks] = useState([]);

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

  useEffect(() => {
    if (!user) return;

    console.log("IN");

    const fetchBookMarks = async () => {
      try {
        const response = await axios.get(`/allbookmarks/${user?._id}`);
        console.log("awdawdawdaw", response.data.bookmarks);
        setBookMarks(response.data.bookmarks);
      } catch (error) {
        message.error("Error recieving bookmarks");
      } finally {
        setLoading(false);
      }
    };
    fetchBookMarks();
  }, [selected]);

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
            img
            loading="lazy"
          />
        </a>
        {[
          {
            img: "/img-pack/icons/profile-user.png",
            label: "Інформація аккаунту",
          },
          {
            img: "/img-pack/icons/dumbbell.png",
            label: "Особистий тренер",
          },
          {
            img: "/img-pack/icons/statistical.png",
            label: "Статистика тренувань",
          },
          {
            img: "/img-pack/icons/gym-station.png",
            label: "Конфігурація ролі",
          },
          { img: "/img-pack/icons/fitness.png", label: "Мої збереження" },
        ].map((item, index) => {
          // ! Change it to user?.role === "trainer" later
          if (item.label === "Особистий тренер" && !user?.role === "trainer")
            return null;

          return (
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
          );
        })}
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
          id="Особистий тренер"
          className={selected === "Особистий тренер" ? "" : "hidePage"}
        >
          <PersonalTrainer user={user} />
        </div>

        <div
          id="Статистика тренувань"
          className={selected === "Статистика тренувань" ? "" : "hidePage"}
        >
          <WorkoutStatisticSection user={user} />
        </div>
        <div
          id="Конфігурація ролі"
          className={selected === "Конфігурація ролі" ? "" : "hidePage"}
        >
          <RoleConfigurationSection user={user} />
        </div>
        <div
          id="Мої збереження"
          className={selected === "Мої збереження" ? "" : "hidePage"}
        >
          <Spin spinning={loading}>
            <BookmarkList bookmarks={bookmarks} />
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
