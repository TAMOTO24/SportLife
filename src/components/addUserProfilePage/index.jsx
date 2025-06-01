// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Avatar, Typography, Divider, Skeleton, Space } from "antd";
import {
  CalendarOutlined,
  SkinOutlined,
  BookOutlined,
} from "@ant-design/icons";
import PostElement from "../addPostElement";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

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
            </Space>
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
