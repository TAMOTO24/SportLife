import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./style.css";
import { Modal, message, Card, Divider } from "antd";

const PostElement = ({ item, hoverable,  theme }) => { // THEME - false ? black/red theme : white/black theme 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(item.like.length);
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token){
      return
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/protected-route");
        setUser(response.data.user);
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const postLike = (userid, id) => { // ! BAG: in comment page likes after reload didn't change
    const token = Cookies.get("token");
    setLoading(true);
    if (!token) {
      message("You need to be logged in to like a post.");
      return;
    }
    if (!user) {
      message("Something went wrong.");
      return;
    }

    axios
      .post(
        "/api/like",
        { userid, id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLikes(response.data.likeCount);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };
  const calculateTimeAgo = (value) => {
    const now = new Date();
    const date = new Date(value);

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} d`;
    if (diffHours > 0) return `${diffHours} h`;
    if (diffMin > 0) return `${diffMin} m`;
    if (diffSec > 0) return `${diffSec} s`;
    return "just now";
  };

  const showModal = (image) => {
    setCurrentImage(image);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
     {/* {hoverable && ( <Divider style={{ background: "#ddd" }} />)} */}
      <Card
        hoverable={hoverable}
        className={!theme && "black-theme-block"}
        bordered={theme}
        onClick={() => {
          if (hoverable) {
            navigate("/newsandinf/comments", {
              state: {
                post: item,
                date: calculateTimeAgo(item.date),
              },
            });
          }
        }}
      >
        <div className="post" key={item.id}>
          <div className="postPhoto">
            <img
              loading="lazy"
              src={item.userIcon || "/img-pack/icons/user-blacktheme.png"}
              alt="UserIcon"
              className={!theme ? "black-theme" : ""}
            />
          </div>

          <div className="postContent">
            <div>
              <div className="postUserContent">
                <div className={`postUser ${!theme && "black-theme-title"}`}>{item.user || "unknown user"}</div>
                <div className="postUsername">@{item.username}</div>
                <div className="postDate">{calculateTimeAgo(item.date)}</div>
              </div>
              <div className={`postText ${!theme && "black-theme-title"}`}>{item.text}</div>
            </div>
            <div className="postGallery">
              {item.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Gallery"
                  loading="lazy"
                  onClick={() => showModal(image)}
                />
              ))}
            </div>
            <div className={`postPanel ${!hoverable ? "disable-block" : ""}`}>
              <a
                className="postLike"
                onClick={(e) => {
                  e.stopPropagation();
                  postLike(user?._id, item._id);
                }}
              >
                <img src="/img-pack/icons/like.png" className={!theme && "black-theme"} loading="lazy" alt="" />
                <div>{likes}</div>
              </a>
              <Link to="" className="postComment">
                <img src="/img-pack/icons/chat.png"  className={!theme ? "black-theme" : ""} loading="lazy" alt="" />
                <div>{item.comment.length}</div>
              </Link>
              <a className="postShare">
                <img src="/img-pack/icons/share.png"  className={!theme ? "black-theme" : ""} loading="lazy" alt="" />
              </a>
              <a className="postSave">
                <img src="/img-pack/icons/favorite.png"  className={!theme ? "black-theme" : ""} loading="lazy" alt="" />
              </a>
            </div>
          </div>
        </div>{" "}
        <Modal
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          centered
          width="60%"
          style={{ top: 20 }}
        >
          <img
            loading="lazy"
            src={currentImage}
            alt="Selected"
            style={{ width: "100%", height: "100%", paddingTop: "40px" }}
          />
        </Modal>
      </Card>
    </>
  );
};

export default PostElement;
