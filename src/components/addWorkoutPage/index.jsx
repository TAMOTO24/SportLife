import React from "react";
import "./style.css"

const WorkoutPage = () => {
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
            <a className="navElements"  key={item.label}>
                <img src={item.src} alt={item.label} />
                <div>
                    {item.label}
                </div>
            </a>
        ))}
      </div>
      <div className="pageBackground">
        <img src="/img-pack/strength-workout.gif" alt="" />
      </div>
    </div>
  );
};

export default WorkoutPage;
