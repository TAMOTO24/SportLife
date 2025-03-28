import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import Loading from "../addLoadingElement";
import { Link } from "react-router-dom";

const TrainerCardElement = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("/trainers");
        setTrainers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Auth error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <>
      <div className="trainer-element">
        <div>
          <div className="wrapper">
            {loading ? (
              <Loading />
            ) : trainers.length === 0 ? (
              <p>No trainers available</p>
            ) : (
              <div className="gallery">
                {trainers.map((item, index) => (
                  <Link to="info" className="card-container" state={{ trainer_info: item }}>
                    <div key={index}>
                      <div
                        className="card"
                        style={{ backgroundImage: `url(${item.profile_img})` }}
                      ></div>
                      <div className="content">
                        <h2>{item.title}</h2>
                        <p>{item.info}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerCardElement;
