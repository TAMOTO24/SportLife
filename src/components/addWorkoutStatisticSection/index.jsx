import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const data = [
  {
    subject: "Math",
    A: 120,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    fullMark: 150,
  },
];

const WorkoutStatisticSection = () => {
  return (
    <>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius={300}
        width={900}
        height={900}
        data={data}
      >
        <PolarGrid stroke="#8884d8" />
        <PolarAngleAxis dataKey="subject" fill="#ccc" stroke="#8884d8" />
        <PolarRadiusAxis stroke="#ccc" />
        <Radar
          name="Mike"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.4}
        />
      </RadarChart>
    </>
  );
};

export default WorkoutStatisticSection;
