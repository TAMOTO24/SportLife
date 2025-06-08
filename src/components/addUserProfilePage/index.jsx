// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Skeleton,
  Space,
  Tag,
  Modal,
  Button,
  message,
  Form,
  Input,
  Select,
} from "antd";
import {
  CalendarOutlined,
  SkinOutlined,
  BookOutlined,
} from "@ant-design/icons";
import PostElement from "../addPostElement";
import axios from "axios";
import { createNotification } from "../../function";

const { TextArea } = Input;
const { Option } = Select;

const { Title, Text, Paragraph } = Typography;

const UserProfile = () => {
  const { userId } = useParams();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentuserdata, setCurrentUser] = useState(undefined);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const roles = [{ label: "user" }, { label: "trainer" }, { label: "admin" }];

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      try {
        const response = await axios.get("/currentuserdata");
        setCurrentUser(response.data.user);
      } catch (error) {
        console.log("Error retrieving user data");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/userbyid/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`/postbyid/${userId}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = (values) => {
    axios.put(`/changerole/${user?._id}`, { role: values.newRole });

    message.success(`Роль користувача ${user?.username} змінена успішно`);
    createNotification(
      `Причиною було зазначено - ${values.message}`,
      `Вашу роль було змінено адміном ${currentuserdata?.username}!`,
      "warning",
      user?._id,
      "",
      "",
      ""
    );
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Card
        style={{ marginBottom: 24 }}
        loading={loadingUser}
        cover={
          user?.coverImage && (
            <img
              alt="cover"
              src={user.coverImage}
              style={{ height: 200, objectFit: "cover" }}
            />
          )
        }
      >
        <Space align="start">
          <Avatar
            size={80}
            src={user?.profile_picture || "/img-pack/icons/user-blacktheme.png"}
          />
          <div style={{ marginLeft: 16 }}>
            <Title level={4} style={{ marginBottom: 0 }}>
              {user?.name} {user?.last_name}
            </Title>
            <Text type="secondary">@{user?.username}</Text>
            <Text type="secondary">
              <Tag color="blue" bordered={false}>
                {user?.role}
              </Tag>
            </Text>
            <br />
            <Text>{user?.email}</Text>
            <Paragraph style={{ marginTop: 8 }}>
              {user?.profileDescription}
            </Paragraph>
            <Space size="large" style={{ marginTop: 12 }}>
              <Text>
                <CalendarOutlined /> Дата реєстрації:{" "}
                <strong>
                  {user?.date &&
                    new Date(user.date).toLocaleDateString("uk-UA")}
                </strong>
              </Text>
              <Text>
                <SkinOutlined /> Тренувань:{" "}
                <strong>{user?.statistic?.length || 0}</strong>
              </Text>
              <Text>
                <BookOutlined /> Постів: <strong>{posts?.length || 0}</strong>
              </Text>
              {currentuserdata?.role === "admin" &&
                currentuserdata._id !== user._id && (
                  <Button color="default" variant="filled" onClick={showModal}>
                    Змінити роль
                  </Button>
                )}
            </Space>

            <Modal
              closable={{ "aria-label": "Custom Close Button" }}
              open={isModalOpen}
              footer={null}
              onCancel={handleCancel}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Avatar
                  size={60}
                  src={
                    user?.profile_picture ||
                    "/img-pack/icons/user-blacktheme.png"
                  }
                />
                <div>
                  <strong>
                    {user?.name} {user?.last_name || ""}
                  </strong>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {user?.role}
                  </div>
                </div>
              </div>
              <Form onFinish={onFinish} layout="vertical" form={form}>
                <Form.Item
                  label="Замінити на"
                  name="newRole"
                  rules={[{ required: true, message: "Оберіть тип" }]}
                >
                  <Select placeholder="Виберіть роль">
                    {roles
                      .filter((role) => role.label !== user?.role)
                      .map((role) => (
                        <Option key={role.value} value={role.label}>
                          {role.label}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Причина"
                  name="message"
                  rules={[
                    { required: true, message: "Введіть текст повідомлення" },
                  ]}
                >
                  <TextArea rows={4} placeholder="Тому, що..." />
                </Form.Item>

                <Button block loading={loadingUser} htmlType="submit">
                  Змінити
                </Button>
              </Form>
            </Modal>
          </div>
        </Space>
      </Card>

      <Divider>Пости користувача</Divider>

      {loadingPosts ? (
        <Skeleton active />
      ) : posts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map((post) => (
            <PostElement item={post} hoverable={true} theme={true} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "#888",
            fontSize: "18px",
            border: "1px dashed #ccc",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          Цей користувач ще не створював пости.
        </div>
      )}
    </div>
  );
};

export default UserProfile;
