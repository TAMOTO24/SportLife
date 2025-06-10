import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./style.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import PostElement from "../addPostElement";

function NewsInfoPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("/api/getposts", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
          params: {
            t: new Date().getTime(),
          },
        })
        .then((response) => setPosts([...response.data]))
        .catch((error) => console.error(error));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="newsInfoPage">
      {Cookies.get("token") && (
        <Link to="/createpostpage" className="addPostButton">
          <div></div>
        </Link>
      )}
      {posts.map((item) => (
        <PostElement item={item} hoverable={true} theme={true} />
      ))}
    </div>
  );
}

export default NewsInfoPage;
