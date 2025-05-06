import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  Upload,
  Checkbox,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./style.css";
// import { set } from "mongoose";
import AuthContext from "../../authprovider.js";

const { Option } = Select;

const AuthPage = () => {
  const [form] = Form.useForm();
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState("signin");
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  useEffect(() => {
    const existingToken = Cookies.get("token");
    // Auth protection for the page
    if (existingToken) {
      navigate("/");
    }
    setEmail(searchParams.get("email"));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    if (authType === "signin") {
      // Login user
      try {
        await login(values.email, values.password, navigate, message);
      } catch (err) {
        message.error("Error during login.");
      }
    } else {
      // Register new user
      try {
        await signup(
          values.email,
          values.username,
          values.name,
          values.lastname,
          values.password,
          values.prefix + values.phone,
          "path",
          values.gender,
          values.role,
          navigate,
          message
        );
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
            <h1>{authType !== "signup" ? "Log in" : "Register"}</h1>
          </div>
          <Form
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ email: searchParams.get("email") }}
            style={{ width: "600px" }}
          >
            {/* Email field */}
            {authType == "signup" && (
              <>
                {" "}
                <Form.Item
                  label="Nickname"
                  name="username"
                  tooltip="What do you want others to call you?"
                  rules={[
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="username" />
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} placeholder="name" />
                </Form.Item>
                <Form.Item
                  name="lastname"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your last name!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} placeholder="lastname" />
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Email"
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
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            {authType == "signup" && (
              <>
                <Form.Item
                  label="Confirm Password"
                  name="password2"
                  tooltip="Enter same password twice to comfirm ur password"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password again!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                    placeholder="phone number"
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
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Pick optional human gender">
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Gym role"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select you'r gym role" allowClear>
                    <Option value="trainer">trainer</Option>
                    <Option value="visiter">visiter</Option>
                    <Option value="online-visiter">online visiter</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Should accept agreement")
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I have read the <a href="">agreement</a>
                  </Checkbox>
                </Form.Item>
              </>
            )}

            {/* Continue button */}
            <Button
              type={authType === "signin" ? "primary" : "default"}
              block
              htmlType="submit"
              loading={loading}
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
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
          <p style={{ marginTop: 20, fontSize: 12, textAlign: "center" }}>
            <Link to="/authpage">Terms of Use</Link> |{" "}
            <Link href="#">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
