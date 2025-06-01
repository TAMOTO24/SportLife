import React, { useState, useEffect } from "react";
import {
  Input,
  Space,
  Card,
  Avatar,
  Typography,
  Pagination,
  Divider,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Search } = Input;

const PAGE_SIZE = 5;

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/allusers");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.log("Error receiving users ", err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        user.username?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div style={{ padding: 88 }}>
      <h1>Користувачі</h1>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Search
          placeholder="Пошук за імʼям, username або email"
          allowClear
          enterButton="Пошук"
          size="large"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />

        <div>
          {paginatedUsers.map((item) => (
            <Card
              key={item._id}
              hoverable
              style={{ marginBottom: 16 }}
              onClick={() => navigate(`/userspage/profile/${item._id}`)}
            >
              <Space align="center">
                <Avatar
                  size={64}
                  src={
                    item.profile_picture ||
                    "/img-pack/icons/user-blacktheme.png"
                  }
                  alt={`${item.name} ${item.last_name}`}
                />
                <div>
                  <Text strong style={{ fontSize: 20 }}>
                    {item.name} {item.last_name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    @{item.username}
                  </Text>
                </div>
              </Space>
            </Card>
          ))}

          <Divider />

          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={filteredUsers.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{ textAlign: "center", marginTop: 16 }}
          />
        </div>
      </Space>
    </div>
  );
};

export default UsersPage;
