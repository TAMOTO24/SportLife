import React, { useState, useEffect } from "react";
import "./style.css";
import {
  Card,
  Avatar,
  Form,
  Input,
  Upload,
  Button,
  message,
  Row,
  Col,
  Select,
  Space,
} from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  UploadOutlined,
  EditOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loading from "../addLoadingElement";

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
  const [form] = Form.useForm();
  // const [searchParams] = useSearchParams();
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("Account info");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success("Profile picture uploaded successfully!");
    } else if (info.file.status === "error") {
      message.error("Upload failed.");
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/protected-route");
        setUser(response.data.user);
      } catch (error) {
        message.error("Error retrieving user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="accountPage">
      <div className={`accountNavBlock ${active ? "activeBlock" : ""}`}>
        <a className="menuBlock" onClick={() => setActive(!active)}>
          <img
            src={
              active
                ? "./img-pack/icons/close.png"
                : "./img-pack/icons/menu.png"
            }
            id="menu"
          />
        </a>
        {[
          { img: "./img-pack/icons/profile-user.png", label: "Account info" },
          {
            img: "./img-pack/icons/dumbbell.png",
            label: "Current workout plan",
          },
          {
            img: "./img-pack/icons/statistical.png",
            label: "Workout statistic",
          },
          { img: "./img-pack/icons/gym-station.png", label: "Current Trainer" },
          { img: "./img-pack/icons/fitness.png", label: "Favorite workouts" },
        ].map((item, index) => (
          <a
            key={index}
            className={`elementBlock ${
              selected === item.label ? "selected" : ""
            }`}
            onClick={() => setSelected(item.label)}
          >
            <img loading="lazy" src={item.img} alt={item.label} />
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
          <Row gutter={[16, 16]} style={{ marginBlock: "50px" }}>
            <Col span={2} style={{ textAlign: "center" }}>
              <Avatar size={100} src={user.profile_picture} />
            </Col>
            <Col span={2}>
              <Space direction="vertical" size={10}>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <Button icon={<EditOutlined />}>Change Avatar</Button>
              </Space>
            </Col>
          </Row>

          <Form
            form={form}
            layout="vertical"
            // onFinish={handleSubmit}
            initialValues={user}
          >
            <Form.Item name="name" label="First Name">
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item name="last_name" label="Last Name">
              <Input placeholder="Last Name" />
            </Form.Item>

            <Form.Item name="username" label="Username">
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input prefix={<MailOutlined />} placeholder="Email address" />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number">
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>

            {/* <Form.Item name="role" label="Role">
          <Select>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
            <Option value="coach">Coach</Option>
          </Select>
        </Form.Item> */}

            {/* <Form.Item name="profilePic" label="Profile Picture">
                <Upload
                  name="file"
                  listType="picture"
                  showUploadList={false}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>
                    Upload Profile Picture
                  </Button>
                </Upload>
              </Form.Item> */}

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
              />
            </Form.Item>

            <Form.Item>
              <Space size={10}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Save Changes
                </Button>
                <Button htmlType="button">Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
          {/* </Card> */}
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
