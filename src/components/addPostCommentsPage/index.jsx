import React, { useState, useEffect } from "react";
import { Input, Empty, Typography, Button, Avatar, message } from "antd";
import { useLocation } from "react-router-dom";
import "./style.css";
import PostElement from "../addPostElement";
import axios from "axios";
import Cookies from "js-cookie";
import CommentElement from "../addCommentElement";
import Loading from "../addLoadingElement";

const { TextArea } = Input;

const CommentsPage = () => {
  const location = useLocation();
  const { date, postId } = location.state || {};
  const [post, setPost] = useState(undefined);
  const [user, setUser] = useState(location.state.user || {});
  const [allUsers, setAllUsers] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(postId);
    if (!postId) return;
    setLoading(true);
    axios
      .get(`/post/${postId}`)
      .then((response) => {
        setComments(response.data.comment);
        setPost(response.data);
      })
      .catch(() => message.error("Не удалось загрузить пост"))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.put(`/createcomment/${post._id}`, {
        userId: user._id,
        text: commentText.trim(),
      });

      setComments(response.data.post.comment);
      setCommentText("");
      message.success("Коментар додано!");
    } catch (error) {
      console.error(error);
      message.error("Не вдалося надіслати коментар.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/allusers");
        setAllUsers(response.data);
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [postId]);

  useEffect(() => {
    if (user) return;
    const token = Cookies.get("token");
    if (!token) {
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/currentuserdata");
        setUser(response.data.user);
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (!post) {
    return <Loading />;
  }
  console.log("post is ", post);

  return (
    <div className="commentsPage">
      <PostElement item={post} hoverable={false} theme={true} />

      {user && (
        <div className="commentInputContainer">
          <Avatar
            src={user?.profile_picture || "/img-pack/icons/user-blacktheme.png"}
            size={84}
          />
          <TextArea
            rows={3}
            placeholder="Напишіть коментар..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="commentInput"
          />
          <Button
            type="primary"
            loading={loading}
            onClick={handleSendComment}
            className="sendButton"
          >
            Надіслати
          </Button>
        </div>
      )}

      <div className="commentBlock">
        {comments.length === 0 ? (
          <Empty
            style={{
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            description={
              <Typography.Text>
                Коментарі відсутні. Станьте першим!
              </Typography.Text>
            }
          />
        ) : (
          comments.map((item) => {
            const commentUser = allUsers.find((u) => u._id === item.id);
            return (
              <CommentElement
                key={item._id}
                user={commentUser}
                date={date}
                text={item.text}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
