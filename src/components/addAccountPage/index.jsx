import React, { useState, useEffect } from "react";
import "./style.css";


const AccountPage = () => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("Account info"); // Сохраняем выбранный элемент

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <div className="accountPage">
      <div className={`accountNavBlock ${active ? "activeBlock" : ""}`}>
        <a className="menuBlock" onClick={() => setActive(!active)}>
          <img
            src={active ? "./img-pack/close.png" : "./img-pack/menu.png"}
            id="menu"
          />
        </a>
        {[
          { img: "./img-pack/profile-user.png", label: "Account info" },
          { img: "./img-pack/dumbbell.png", label: "Current workout plan" },
          { img: "./img-pack/statistical.png", label: "Workout statistic" },
          { img: "./img-pack/gym-station.png", label: "Current Trainer" },
          { img: "./img-pack/fitness.png", label: "Favorite workouts" },
        ].map((item, index) => (
          <a
            key={index}
            className={`elementBlock ${
              selected === item.label ? "selected" : ""
            }`}
            onClick={() => setSelected(item.label)}
          >
            <img src={item.img} alt={item.label} />
            <div className={active ? "activeButton" : ""}>{item.label}</div>
          </a>
        ))}
      </div>
      <div id="pages">
        <div id="Account info">
          <h1>{selected}</h1>
          
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
