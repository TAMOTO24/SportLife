import React from "react";
import "./style.css";

const TrainerCardElement = () => {
  return (
    <div className="trainer-element">
      <div>
        <div className="wrapper">
          <div className="gallery">
            {[
              { to: "", label: "Running", src: "./img-pack/page1.jpg" },
              { to: "", label: "Stretching", src: "./img-pack/stretch.png" },
              { to: "", label: "Yoga", src: "./img-pack/yoga.png" },
              { to: "", label: "Strength", src: "./img-pack/strength.png" },
              { to: "", label: "Cardio", src: "./img-pack/cardiology.png" },
            ].map((item) => (
              <div className="card"><img src={item.src} alt={item.label} /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCardElement;
