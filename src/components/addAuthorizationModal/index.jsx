import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Divider } from 'antd';
import { GoogleOutlined, AppleOutlined, PhoneOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './style.css';

// Mock database
const mockDB = ["test@example.com", "user@gmail.com", "admin@company.com"];

const AuthModal = ({ visible, onCancel }) => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailCheck = () => {
    setLoading(true);
    setTimeout(() => {
      if (mockDB.includes(email)) {
        setIsEmailValid(true);
        message.success("Email found! Please enter your password.");
      } else {
        message.error("Email not registered.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogin = (values) => {
    console.log("Login with data:", values);
    message.success("Login successful!");
  };

  return (
    <Modal title="Authentication" visible={visible} onCancel={onCancel} footer={null} width={350}>
      <div style={{ textAlign: "center" }}>
        <h1>Welcome back</h1>
      </div>
      <Form onFinish={handleLogin} layout="vertical">
        {/* Email field */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Invalid email format!" }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailValid}
          />
        </Form.Item>

        {/* Continue button */}
        {!isEmailValid && (
          <Button type="primary" block onClick={handleEmailCheck} loading={loading}>
            Continue
          </Button>
        )}

        {/* Password field if email is found */}
        {isEmailValid && (
          <>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </>
        )}
      </Form>

      {/* Registration */}
      <p style={{ marginTop: 10, textAlign: "center" }}>
        Don't have an account? <a href="#">Sign Up</a>
      </p>

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
