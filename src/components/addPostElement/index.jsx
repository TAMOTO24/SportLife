import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./style.css";
import { Modal, message, Card, Popconfirm, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import BookMark from "../addBookMarkElement/index";

const PostElement = ({ item, hoverable, theme }) => {
  // THEME - false ? black/red theme : white/black theme
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(() =>
    Array.isArray(item?.like) ? item.like.length : 0
  );
  const [user, setUser] = useState(undefined);
  const [creator, setCreator] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUseIdData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/userbyid/${item?.created_by}`);
        setCreator(response.data);
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUseIdData();
  }, []);

  useEffect(() => {
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

  const deletePost = async (postId) => {
    try {
      await axios.delete(`/post/${postId}`);
      message.error("Пост видалений успішно.");
    } catch (error) {
      message.error("Не вдалося видалити пост.");
      console.error(error);
    }
  };

  const postLike = (userid, id) => {
    const token = Cookies.get("token");
    setLoading(true);
    if (!token) {
      message.warning("You need to be logged in to like a post.");
      return;
    }
    if (!user) {
      message.error("Something went wrong.");
      return;
    }

    axios
      .put(
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
      <Card
        hoverable={hoverable}
        className={!theme && "black-theme-block"}
        style={{ maxWidth: "975px" }}
        bordered={theme}
        onClick={() => {
          if (hoverable) {
            navigate("/newsandinf/comments", {
              state: {
                postId: item._id,
                date: calculateTimeAgo(item.date),
                user: user,
              },
            });
          }
        }}
      >
        <div className="post" key={item.id}>
          <div className="postPhoto">
            <img
              loading="lazy"
              src={
                creator?.profile_picture ||
                "/img-pack/icons/user-blacktheme.png"
              }
              alt="UserIcon"
              className={
                !theme && !creator?.profile_picture ? "black-theme" : ""
              }
            />
          </div>

          <div className="postContent">
            <div>
              <div className="postUserAction">
                <div className="postUserContent">
                  <div className={`postUser ${!theme && "black-theme-title"}`}>
                    {creator?.name || "Uknown"}
                  </div>
                  <div className="postUsername">@{creator?.username}</div>
                  <div className="postDate">{calculateTimeAgo(item.date)}</div>
                </div>
                {user?._id === item?.created_by && (
                  <Popconfirm
                    title="Ви впевнені, що хочете видалити пост?"
                    description="Ця дія необоротна."
                    onConfirm={(e) => {
                      e.stopPropagation();
                      deletePost(item?._id);
                    }}
                    okText="Так"
                    cancelText="Скасувати"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Видалити
                    </Button>
                  </Popconfirm>
                )}
              </div>

              <div className={`postText ${!theme && "black-theme-title"}`}>
                {item.text}
              </div>
            </div>
            <div className="postGallery">
              {item.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Gallery"
                  loading="lazy"
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(image);
                  }}
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
                <img
                  src="/img-pack/icons/like.png"
                  className={!theme && "black-theme"}
                  loading="lazy"
                  alt=""
                />
                <div>{likes}</div>
              </a>
              <Link to="" className="postComment">
                <img
                  src="/img-pack/icons/chat.png"
                  className={!theme ? "black-theme" : ""}
                  loading="lazy"
                  alt=""
                />
                <div>{item.comment.length}</div>
              </Link>
              <a className="postShare">
                <img
                  src="/img-pack/icons/share.png"
                  className={!theme ? "black-theme" : ""}
                  loading="lazy"
                  alt=""
                />
              </a>
              <a className="postSave" onClick={(e) => e.stopPropagation()}>
                <BookMark element={item} theme={theme} />
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
