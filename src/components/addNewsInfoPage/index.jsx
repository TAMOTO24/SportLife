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

  return (
    <div className="newsInfoPage">
      {[
        {
          text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni, qui? Ad quisquam aut iusto quia quas dolor cumque modi nam quos! Dolores reiciendis modi alias illum. Est, itaque! Culpa, non.",
          user: "User",
          username: "UserName",
          date: "2h",
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
                <div className="postDate">.{item.date}</div>
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
