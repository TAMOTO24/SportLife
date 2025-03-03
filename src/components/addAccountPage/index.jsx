import React, { useState, useEffect } from "react";
import "./style.css";
import { Form, Input, Button, Upload, message } from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const data = [
  {
    subject: "Math",
    A: 120,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    fullMark: 150,
  },
];

const AccountPage = () => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("Account info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success("Profile picture uploaded successfully!");
    } else if (info.file.status === "error") {
      message.error("Upload failed.");
    }
  };

  return (
    <div className="accountPage">
      <div className={`accountNavBlock ${active ? "activeBlock" : ""}`}>
        <a className="menuBlock" onClick={() => setActive(!active)}>
          <img
            src={active ? "./img-pack/close.png" : "./img-pack/menu.png"}
            id="menu"
          />
        </a>
        {[
          { img: "./img-pack/profile-user.png", label: "Account info" },
          { img: "./img-pack/dumbbell.png", label: "Current workout plan" },
          { img: "./img-pack/statistical.png", label: "Workout statistic" },
          { img: "./img-pack/gym-station.png", label: "Current Trainer" },
          { img: "./img-pack/fitness.png", label: "Favorite workouts" },
        ].map((item, index) => (
          <a
            key={index}
            className={`elementBlock ${
              selected === item.label ? "selected" : ""
            }`}
            onClick={() => setSelected(item.label)}
          >
            <img src={item.img} alt={item.label} />
            <div className={active ? "activeButton" : ""}>{item.label}</div>
          </a>
        ))}
      </div>
      <div id="pages">
        <h1>{selected}</h1>
        <div
          id="Account info"
          className={selected === "Account info" ? "" : "hidePage"}
        >
          <Form layout="vertical" style={{ maxWidth: "95%", margin: "auto" }}>
            {/* Email field */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#1890ff" }} />}
                placeholder="Email address"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            {/* Username field */}
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#1890ff" }} />}
                placeholder="Username"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            {/* Password field */}
            {/* <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#1890ff" }} />}
                placeholder="Password"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item> */}

            {/* Profile Picture Upload */}
            <Form.Item name="profilePic" label="Profile Picture">
              <Upload
                name="file"
                action="/upload"
                listType="picture"
                showUploadList={false}
                onChange={handleUploadChange}
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

            {/* Profile Description */}
            <Form.Item
              name="profileDescription"
              label="Profile Description"
              rules={[
                {
                  required: true,
                  message: "Please enter your profile description!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Tell us about yourself..."
                rows={4}
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            {/* Continue button */}
            <Form.Item>
              <Button
                type="primary"
                block
                loading={loading}
                style={{
                  backgroundColor: "#1890ff",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  padding: "10px 0",
                  width: "10%",
                }}
              >
                Edit profile
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          id="Workout statistic"
          className={selected === "Workout statistic" ? "" : "hidePage"}
        >
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius={300}
            width={900}
            height={900}
            data={data}
          >
            <PolarGrid stroke="#8884d8" />
            <PolarAngleAxis dataKey="subject" fill="#ccc" stroke="#8884d8" />
            <PolarRadiusAxis stroke="#ccc" />
            <Radar
              name="Mike"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.4}
            />
          </RadarChart>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
