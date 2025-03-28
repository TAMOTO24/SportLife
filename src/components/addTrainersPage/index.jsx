import React from 'react';
import TrainerCardElement from '../addTrainerCardElement';
import { Progress, Divider, Button, Statistic } from "antd";

const TrainersPage = () => {
  return (
    <>
      <div className="trainersPage" style={{ padding: '20px' }}>
        <h1 style={{ fontSize: "45px" }}>Trainers</h1>
        <p style={{ fontSize: '18px' }}>
          Meet our professional trainers who will guide you through your fitness journey.
        </p>
      </div>
      <Divider style={{ background: "#ddd" }} />
      <TrainerCardElement />
    </>
  );
};

export default TrainersPage;
