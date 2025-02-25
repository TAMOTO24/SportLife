import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { Modal } from "antd";

function NewsInfoPage() {
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    axios
      .get("/api/getposts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error));
  }, []);

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
    <div className="newsInfoPage">
      {posts.map((item) => (
        <div className="post" key={item.id}>
          <div className="postPhoto">
            <img src={item.userIcon} alt="UserIcon" />
          </div>

          <div className="postContent">
            <div>
              <div className="postUserContent">
                <div className="postUser">{item.user}</div>
                <div className="postUsername">@{item.username}</div>
                <div className="postDate">{calculateTimeAgo(item.date)}</div>
              </div>
              <div className="postText">{item.text}</div>
            </div>
            <div className="postGallery">
              {item.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Gallery"
                  onClick={() => showModal(image)}
                />
              ))}
            </div>
            <div className="postPanel">
              <a className="postLike"><img src="./img-pack/like.png" alt="" /><div>{item.like.length}</div></a>
              <a className="postComment"><img src="./img-pack/chat.png" alt="" /><div>{item.comment.length}</div></a>
              <a className="postShare"><img src="./img-pack/share.png" alt="" /></a>
              <a className="postSave"><img src="./img-pack/favorite.png" alt="" /></a>
            </div>
          </div>
        </div>
      ))}

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
        width="60%"
        style={{ top: 20 }}  
      >
        <img src={currentImage} alt="Selected" style={{ width: "100%", height: "100%", paddingTop: "40px"}} />
      </Modal>
    </div>
  );
}

export default NewsInfoPage;
