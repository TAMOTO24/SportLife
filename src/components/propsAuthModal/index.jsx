import React, { useState, useEffect, useContext } from "react";
import AuthModal from "../addAuthorizationModal";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../authprovider.js";
import "./style.css";
import axios from "axios";
import { Avatar, Spin } from "antd";

const Auth = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(undefined);
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const hideModal = () => setIsModalVisible(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/currentuserdata")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => console.error("Auth error", error))
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setIsOpen(false);
    };
  }, []);

  const handleAuthClick = async () => {
    await logout(navigate);
  };

  return (
    <>
      <div id="authblockdropdown">
        <a>
          <Spin spinning={loading}>
            <Avatar
              id="userIcon"
              onClick={() =>
                !user ? setIsModalVisible(!isModalVisible) : setIsOpen(!isOpen)
              }
              src={user?.profile_picture || "/img-pack/icons/user.png"}
              alt="userImg"
              size={60}
              style={{ cursor: "pointer" }}
            />
          </Spin>
          {isOpen && (
            <div className="dropdownAuthBlock">
              <p>@{user.username}</p>
              <Link to="/account">
                <div id="DPAuthLink">Аккаунт</div>
              </Link>
              <a onClick={handleAuthClick}>
                <div id="DPAuthLink">Вийти</div>
              </a>
            </div>
          )}
        </a>
      </div>

      <AuthModal visible={isModalVisible} onCancel={hideModal} />
    </>
  );
};

export default Auth;
