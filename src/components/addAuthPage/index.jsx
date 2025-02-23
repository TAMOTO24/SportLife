import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, message, Upload} from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "./style.css";
// import { set } from "mongoose";
import AuthContext from "../../authprovider.js";

const AuthPage = () => {
  const [form] = Form.useForm();
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState("signin");

  useEffect(() => {
    setEmail(searchParams.get("email"));
  }, []);


  const onFinish = async (values) => {
    setLoading(true);
    console.log("Received values of form:", values);

    if (authType === "signin") { // Login user
      try {
        await login(values.email, values.password, navigate, message);
      } catch (err) {
        message.error("Error during login.");
      }
    } else { // Register new user
      try {
        await signup(values.email, values.username, values.password, navigate, message);
      } catch (err) {
        message.error("Error during login.", err);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="auth-container">
        <div>
          <div style={{ textAlign: "center" }}>
            <h1>{authType ? "Log in" : "Register"}</h1>
          </div>
          <Form
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ email: searchParams.get("email") }}
          >
            {/* Email field */}
            {authType == "signup" && (
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="username" />
              </Form.Item>
            )}
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
                { min: 6, message: "Password must be at least 6 characters!" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item name="profilePic" label="Profile Picture">
              <Upload
                name="file"
                action="/upload"
                listType="picture"
                showUploadList={false}
                // onChange={handleUploadChange}
                beforeUpload={() => false} // Prevent auto-uploading
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ width: "100%", borderRadius: "8px" }}
                >
                  Upload Profile Picture
                </Button>
              </Upload>
            </Form.Item>

            {/* Continue button */}
            <Button
              type={authType === "signin" ? "primary" : "default"}
              block
              htmlType="submit"
              loading={loading}
            >
              {authType === "signin" ? "Log In" : "Sign Up"}
            </Button>
          </Form>
          <p style={{ marginTop: 10, textAlign: "center" }}>
            {authType === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <a
              href="#"
              onClick={() =>
                setAuthType(authType === "signin" ? "signup" : "signin")
              }
            >
              {authType === "signin" ? "Sign Up" : "Sign In"}
            </a>
          </p>
        </div>

        <div>
          {/* Terms and Privacy */}
          <p style={{ marginTop: 20, fontSize: 12, textAlign: "center" }}>
            <Link to="/authpage">Terms of Use</Link> | <Link href="#">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
