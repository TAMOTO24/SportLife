// import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";

function NewsInfoPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get("/api/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));

    // const interval = setInterval(() => {
    //   setActiveIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    // }, 3000);

    // return () => clearInterval(interval);
  }, []);

  const calculateTimeAgo = (value) => { 
    const now = new Date();

    const diffMs = now - value;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} .d`;
    if (diffHours > 0) return `${diffHours} .h`;
    if (diffMin > 0) return `${diffMin} .m`;
    return "just now";
  };

  return (
    <div className="newsInfoPage">
      {[
        {
          text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni, qui? Ad quisquam aut iusto quia quas dolor cumque modi nam quos! Dolores reiciendis modi alias illum. Est, itaque! Culpa, non.",
          user: "User",
          username: "UserName",
          date: Date("1999-12-31T22:00:00.000+00:00"),
          gallery: [],
          userIcon: "./img-pack/user-blacktheme.png",
        },
        {
          text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni, qui? Ad quisquam aut iusto quia quas dolor cumque modi nam quos! Dolores reiciendis modi alias illum. Est, itaque! Culpa, non.",
          user: "User",
          username: "UserName",
          date: "2h",
          gallery: [],
          userIcon: "./img-pack/user-blacktheme.png",
        },
      ].map((item) => (
        <div className="post">
          <div className="postPhoto">
            <img src={item.userIcon} alt="UserIcon" />
          </div>

          <div className="postContent">
            <div>
              <div className="postUserContent">
                <div className="postUser">{item.user}</div>
                <div className="postUsername">@{item.username}</div>
                <div className="postDate">{calculateTimeAgo(item.date)}</div>
              </div>
              <div className="postText">{item.text}</div>
            </div>
            <div className="postGallery">
              <img src="./img-pack/page1.jpg" alt="UserIcon" />
            </div>
            <div className="postPanel">
              <a className="postLike">Like</a>
              <a className="postComment">Comment</a>
              <a className="postShare">Share</a>
              <a className="postSave">Save</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewsInfoPage;
