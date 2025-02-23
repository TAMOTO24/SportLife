import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Divider } from "antd";
import {
  GoogleOutlined,
  AppleOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import axios from "axios";

const AuthModal = ({ visible, onCancel }) => {
  const [email, setEmail] = useState("");
  // const [isEmailValid, setIsEmailValid] = useState(false);
  const [noAccout, setNoAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailItem, setEmailItem] = useState([]);
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
        message.success("Email found! Please enter your password.");
        onCancel();
      } else {
        message.error("Email not found.");
        setNoAccount(true);
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogin = (values) => {
    console.log("Login with data:", values);
    message.success("Login successful!");
  };

  return (
    <Modal
      title="Authentication"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={350}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Welcome back</h1>
      </div>
      <Form onFinish={handleLogin} layout="vertical">
        {/* Email field */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // disabled={isEmailValid}
          />
        </Form.Item>

        {/* Registration */}
        <p style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/authpage" onClick={onCancel}>Sign Up</Link>
        </p>

        {/* Continue button */}
        <Button
          type="primary"
          block
          onClick={handleEmailCheck}
          loading={loading}
        >
          Continue
        </Button>

      </Form>

      <Divider>OR</Divider>

      {/* Social login buttons */}
      <Button icon={<GoogleOutlined />} block style={{ marginBottom: 10 }}>
        Continue with Google
      </Button>
      <Button icon={<AppleOutlined />} block style={{ marginBottom: 10 }}>
        Continue with Apple
      </Button>
      <Button icon={<PhoneOutlined />} block>
        Continue with phone
      </Button>

      {/* Terms and Privacy */}
      <p style={{ marginTop: 20, fontSize: 12, textAlign: "center" }}>
        <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
      </p>
    </Modal>
  );
};

export default AuthModal;
