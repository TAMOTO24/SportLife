import React, { useState } from 'react';
import AuthModal from '../addAuthorizationModal';
import {useNavigate } from "react-router-dom";

const Auth = (user) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);
  const navigate = useNavigate();

  return (
    <>
      <a onClick={() => (user.user === null ? showModal() : navigate("/account"))}><img id="userIcon" src="./img-pack/user.png" alt="userImg"/></a>
      <AuthModal visible={isModalVisible} onCancel={hideModal} />
    </>
  );
};

export default Auth;
