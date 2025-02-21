import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { set } from "mongoose";
// import Password from "antd/es/input/Password";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailItem, setEmailItem] = useState([]);
  const navigate = useNavigate();
  const [authType, setAuthType] = useState("signin");

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

  // const handleCheck = (auth) => {
  //   setLoading(true);
  //   // const values = form.getFieldsValue();

  //   setTimeout(() => {
  //     if (auth == "signin") { //Autherisation function
  //       // if (emailItem.includes(email)) {
  //       //   // navigate("/infpage");
  //       //   message.success("Email found! Please enter your password.");
  //       // } else {
  //       //   message.error("Email not registered.");
  //       // }

  //     }else{

  //     }
  //     setLoading(false);
  //   }, 1000);
  // };
  const handleCheck = async (auth) => {
    setLoading(true);

    if (auth === "signin") {
    } else {
      const userData = {
        email: "john.doe@example.com",
        username: "JohnDoe",
        password : "test1234" 
      };

      try {
        const response = await axios.post("/api/newuser", userData);
        console.log("Response:", response.data);
        message.success("User registered successfully!");
      } catch (error) {
        console.error("Error sending POST request:", error);
        message.error("Error during registration.");
      }
    }

    setLoading(false);
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
            <h1>{authType ? "Log in" : "Register"}</h1>
          </div>
          <Form
            onFinish={handleLogin}
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
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            {/* Continue button */}
            <Button
              type={authType === "signin" ? "primary" : "default"}
              block
              onClick={() =>
                handleCheck(authType === "signin" ? "signin" : "signup")
              }
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
