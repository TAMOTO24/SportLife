import React, { useState } from "react";
import { Modal, Image, message, Input, Divider, Button, Avatar } from "antd";
import { useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./style.css";
import PostElement from "../addPostElement";

const { TextArea } = Input;

const CommentsPage = () => {
  const location = useLocation();
  const { post, date } = location.state || {};

  return (
    <>
      <div className="commentsPage">
        <PostElement item={post} hoverable={false} />
        <div className="commentBlock">
          {post.comment.map((item) => (
            <div key={item._id} className="commentContainer">
              <Avatar size={64} icon={<UserOutlined />} />
              <div className="commentContent">
                {" "}
                {/* TODO: make id recognision comment user */}
                <div className="postUserContent">
                  <div className="postUser">{post.user || "unknown user"}</div>
                  <div className="postUsername">@{post.username}</div>
                  <div className="postDate">{date}</div>
                </div>
                <div>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentsPage;
