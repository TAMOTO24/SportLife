import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import {
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import axios from "axios";
import sections from "../../sections";

const AuthModal = ({ visible, onCancel }) => {
  const [email, setEmail] = useState("");
  const [noAccout, setNoAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailItem, setEmailItem] = useState([]);
  const [modalInfo, setModalInfo] = useState({ visible: false, title: '', content: '' });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/email")
      .then((response) => {
        setEmailItem(response.data.map((item) => item.email));
      })
      .catch((error) => console.error(error));
  }, []);

  const handleEmailCheck = () => {
    setLoading(true);

    setTimeout(() => {
      if (emailItem.includes(email)) {
        navigate("/authpage?email=" + email);
        message.success("Пошту знайдено введіть ваш пароль!");
        onCancel();
      } else {
        message.error("Пошти не знайдено, зареєструйтеся!");
        setNoAccount(true);
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogin = (values) => {
    message.success("Login successful!");
  };

  const showSectionModal = (key) => {
    const section = sections[key];
    setModalInfo({
      visible: true,
      title: section.title,
      content: section.content,
    });
  };

  const handleCloseSectionModal = () => {
    setModalInfo(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      <Modal
        title="Авторизація"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Ласкаво просимо!</h1>
          <h5>Введіть пошту для її знаходження</h5>
        </div>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Поштова адреса"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <p style={{ textAlign: "center" }}>
            Немає облікового запису? <Link to="/authpage" onClick={onCancel}>Зареєструватися</Link>
          </p>

          <Button
            type="primary"
            block
            onClick={handleEmailCheck}
            loading={loading}
          >
            Продовжити
          </Button>
        </Form>

        <p style={{ marginTop: 20, fontSize: 8, textAlign: "center", display: "flex", justifyContent: 'space-between' }}>
          <Button type="link" onClick={() => showSectionModal("terms")} >
            Умови використання
          </Button>
          <Button type="link" onClick={() => showSectionModal("policy")}>
            Політика конфіденційності
          </Button>
        </p>
      </Modal>

      <Modal
        open={modalInfo.visible}
        title={modalInfo.title}
        onCancel={handleCloseSectionModal}
        onOk={handleCloseSectionModal}
        centered
        footer={[
          <Button key="ok" type="primary" onClick={handleCloseSectionModal}>
            Закрити
          </Button>
        ]}
      >
        <div>
          {modalInfo.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph.trim()}</p>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AuthModal;
