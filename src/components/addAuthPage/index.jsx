import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import {
  GoogleOutlined,
  AppleOutlined,
  PhoneOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { set } from "mongoose";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailItem, setEmailItem] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/email")
      .then((response) => {
        setEmailItem(response.data.map((item) => item.email));
        console.log(response.data);
      })
      .catch((error) => console.error(error));

      setEmail(searchParams.get("email"));
  }, []);

  const handleEmailCheck = () => {
    setLoading(true);

    setTimeout(() => {
      if (emailItem.includes(email)) {
        // navigate("/infpage");
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
    <>
      <div className="auth-container">
        <div>
          <div style={{ textAlign: "center" }}>
            <h1>Welcome back</h1>
          </div>
          <Form onFinish={handleLogin} layout="vertical" initialValues={{ email: searchParams.get("email") }}>
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
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

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
          <p style={{ marginTop: 10, textAlign: "center" }}>
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>

        <div>
          {/* Terms and Privacy */}
          <p style={{ marginTop: 20, fontSize: 12, textAlign: "center" }}>
            <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
