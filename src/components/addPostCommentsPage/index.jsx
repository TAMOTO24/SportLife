import React, { useState, useEffect } from "react";
import { Input, Empty, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./style.css";
import PostElement from "../addPostElement";
import axios from "axios";
import CommentElement from "../addCommentElement";

const { TextArea } = Input;

const CommentsPage = () => {
  const location = useLocation();
  const { post, date } = location.state || {};

  return (
    <>
      <div className="commentsPage">
        <PostElement item={post} hoverable={false} theme={true} />
        <div className="commentBlock">
          {post.comment.length === 0 ? (
            <Empty
              style={{ height: "50vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
              description={
                <Typography.Text>
                  No comments yet. Be the first to comment!
                </Typography.Text>
              }
            />
          ) : (
            post.comment.map((item) => (
              <CommentElement
                key={item._id}
                id={item.id}
                date={date}
                text={item.text}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CommentsPage;
