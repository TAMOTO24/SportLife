import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd";

const WorkoutResult = () => {
  const location = useLocation();
  const resultData = location.state?.result;

  if (!resultData) {
    return <div>Немає даних для відображення результату тренування.</div>;
  }

  console.log(resultData);

  return (
    <div style={{ padding: 20 }}>
      <h2>Результат тренування</h2>

      <div>
        <strong>Час початку:</strong>{" "}
        {new Date(resultData.startTime).toLocaleString()}
      </div>
      <div>
        <strong>Тривалість тренування:</strong> {resultData.trainingTime}
      </div>
      <div>
        <strong>ID користувача:</strong> {resultData.userId}
      </div>
      <div>
        <strong>ID кімнати:</strong> {resultData.roomId}
      </div>
      <div>
        <strong>Кількість вправ:</strong> {resultData.exerciseCount}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Програма тренування</h3>
        <div>
          <strong>Назва:</strong> {resultData.workout?.title}
        </div>
        <div>
          <strong>Опис:</strong> {resultData.workout?.description}
        </div>
        <div>
          <strong>Тип:</strong> {resultData.workout?.type}
        </div>
      </div>

      <div style={{ marginTop: 20, overflowY: "auto", maxHeight: "400px" }}>
        <h3>Виконані вправи</h3>
        {resultData.data?.map((exercise, index) => (
          <div
            key={index}
            style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}
          >
            <strong>{exercise.name}</strong>
            <div>
              М'язи:{" "}
              {Object.entries(exercise.muscleGroups).map(([muscle, value]) => (
                <p key={muscle}>
                  {muscle}: {value}%
                </p>
              ))}
            </div>
            <div>
              Підходи: {exercise.sets}, Повтори: {exercise.reps}
            </div>
            <div>Обладнання: {exercise.equipment}</div>
            <div>Техніка: {exercise.technique}</div>
            <div>Поради: {exercise.tips}</div>
            <div>Відпочинок: {exercise.restTime} сек</div>
          </div>
        ))}
      </div>
      <div>
        <Button type="primary">Зберегти результат</Button>
        <Button type="default" style={{ marginLeft: 10 }}>
          На головну
        </Button>
      </div>
    </div>
  );
};

export default WorkoutResult;
