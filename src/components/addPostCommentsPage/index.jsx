import React, { useState, useEffect, useRef } from "react";
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
  const commentTextRef = useRef("");
  const [comments, setComments] = useState(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const handleDeleteComment = async (comment) => {
    try {
      const response = await axios.delete(
        `/deletecomment/${post._id}/${comment}`
      );
      setPost(response.data.updatedPost);
      setComments(response.data.updatedPost.comment);
    } catch (error) {
      message.error("Не вдалося видалити коментар.");
      console.error(error);
    }
  };

  const handleSendComment = async () => {
    if (!commentTextRef.current.trim()) return;

    try {
      setLoading(true);
      const response = await axios.put(`/createcomment/${post._id}`, {
        userId: user._id,
        text: commentTextRef.current.trim(),
      });

      setComments(response.data.post.comment);
      commentTextRef.current = "";
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

  return (
    <div className="commentsPage">
      <PostElement item={post} hoverable={false} theme={true} />

      {user._id && (
        <div className="commentInputContainer">
          <Avatar
            src={user?.profile_picture || "/img-pack/icons/user-blacktheme.png"}
            size={84}
          />
          <TextArea
            rows={3}
            placeholder="Напишіть коментар..."
            defaultValue=""
            onChange={(e) => {
              commentTextRef.current = e.target.value;
            }}
            className="commentInput"
            ref={(el) => {
              if (el && commentTextRef.current === "") {
                el.resizableTextArea.textArea.value = "";
              }
            }}
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
                commentUserId={item.id}
                currentUser={user}
                text={item.text}
                date={date}
                onDelete={handleDeleteComment}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
