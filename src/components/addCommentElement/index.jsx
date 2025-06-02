import React, { useEffect, useState } from "react";
import { Avatar, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Loading from "../addLoadingElement";

const CommentElement = ({ user, date, text }) => {
  return (
    <>
      <div className="commentContainer">
        <Avatar
          size={84}
          icon={
            user?.profile_picture ? (
              <img src={user?.profile_picture} alt="user" />
            ) : (
              <UserOutlined />
            )
          }
        />
        <div className="commentContent">
          {/* TODO: make id recognision comment user */}
          <div className="postUserContent">
            <div className="postUser">{user?.name || "unknown user"}</div>
            <div className="postUsername">@{user?.username}</div>
            {/* <div className="postDate">{date}</div> */}
          </div>
          <div className="commentText">{text}</div>
        </div>
      </div>
    </>
  );
};

export default CommentElement;
