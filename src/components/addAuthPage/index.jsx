import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Divider } from 'antd';
import { GoogleOutlined, AppleOutlined, PhoneOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ visible, onCancel }) => {
  const [email, setEmail] = useState("");
  // const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailItem, setEmailItem] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/email")
      .then(response => {
        setEmailItem(response.data.map(item => item.email));
        console.log(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleEmailCheck = () => {
    setLoading(true);
   
    setTimeout(() => {
      if (emailItem.includes(email)) {
        navigate("/infpage");
        message.success("Email found! Please enter your password."); 
        onCancel();
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
    <>
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
            // disabled={isEmailValid}
          />
        </Form.Item>

        {/* Continue button */}
          <Button type="primary" block onClick={handleEmailCheck} loading={loading}>
            Continue
          </Button>
        

        {/* Password field if email is found
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
        )} */}
      </Form>

      {/* Registration */}
      <p style={{ marginTop: 10, textAlign: "center" }}>
        Don't have an account? <a href="#">Sign Up</a>
      </p>

      <Divider>OR</Divider>

      {/* Terms and Privacy */}
      <p style={{ marginTop: 20, fontSize: 12, textAlign: "center" }}>
        <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
      </p>
    </>
  );
};

export default AuthPage;
