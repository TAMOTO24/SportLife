import React, { useState } from 'react';
import AuthModal from '../addAuthorizationModal';

const Auth = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  return (
    <>
      <a onClick={showModal}><img id="userIcon" src="./img-pack/user.png" alt="userImg"/></a>
      <AuthModal visible={isModalVisible} onCancel={hideModal} />
    </>
  );
};

export default Auth;
