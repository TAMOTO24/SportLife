import React, { useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";

const BookMark = ({ element, theme = true }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookMarkStatus, setBookMarkStatus] = useState(null);
  const nameTheme = theme ? "bookmarkW" : "bookmark";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/currentuserdata");
        setUser(response.data.user);
        setBookMarkStatus(
          response.data.user?.bookmarks?.includes(element?._id)
        );
      } catch (error) {
        message.error("Error retrieving user data");
      }
    };
    fetchUserData();
  }, []);

  const fetchBookmark = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`/bookmark/${user?._id}`, {
        bookmarkId: element?._id,
      });
      setBookMarkStatus(res.data.mark_status);
    } catch (error) {
      message.error("Error changing bookmark status");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      style={{
        backgroundColor: "transparent",
        borderRadius: "20px",
        border: "0",
      }}
    >
      <img
        src={`/img-pack/icons/${
          bookMarkStatus ? nameTheme + "_saved.png" : nameTheme + ".png"
        }`}
        style={{ width: "40px", height: "40px", cursor: "pointer" }}
        onClick={fetchBookmark}
      />
    </button>
  );
};

export default BookMark;
