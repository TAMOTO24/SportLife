import React from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";

const WorkoutResult = () => {
    const location = useLocation();
    const resultData = location.state?.result;
    return (
        <>
        <div>
            <div>{resultData?.startTime}</div>
            <div>{resultData?.trainingTime}</div>
            <div>{resultData?.data}</div>
            <div>{resultData?.userId}</div>
            <div>{resultData?.roomId}</div>
            <div>{resultData?.exerciseCount}</div>
            <div>{resultData?.workout}</div>
        </div>
        </>
    );
};

export default WorkoutResult;