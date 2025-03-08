import React from "react";
import "./style.css";

const TrainerCardElement = () => {
  const galleryItems = [
    { to: "", label: "Running", src: "./img-pack/page1.jpg" },
    { to: "", label: "Stretching", src: "./img-pack/stretch.jpg" },
    { to: "", label: "Yoga", src: "./img-pack/page2.jpg" },
    { to: "", label: "Strength", src: "./img-pack/page3.jpg" },
    { to: "", label: "Cardio", src: "./img-pack/page4.png" },
  ];

  return (
    <div className="trainer-element">
      <div>
        <div className="wrapper">
          <div className="gallery">
            {galleryItems.map((item, index) => (
              <div className="card-container" key={index}>
                <div
                  className="card"
                  style={{ backgroundImage: `url(${item.src})` }}
                ></div>
                <div className="content">
                  <h2>{item.title}</h2>
                  <p>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCardElement;
