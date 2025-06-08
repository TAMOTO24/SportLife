import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./style.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import PostElement from "../addPostElement";

function NewsInfoPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/getposts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="newsInfoPage">
      {Cookies.get("token") && (
        <Link to="/createpostpage" className="addPostButton">
          <div></div>
        </Link>
      )}
      {posts.map((item) => (
        <PostElement item={item} hoverable={true} theme={true}/>
      ))}
    </div>
  );
}

export default NewsInfoPage;
