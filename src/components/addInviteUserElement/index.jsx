import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Dropdown, Spin, Button } from "antd";

const InviteUser = ({
  userId,
  message,
  sendFunction = "",
  onSelectUser,
  onlyTrainer = false,
}) => {
  const [allUsers, setAllusers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get("/allusers");
        setAllusers(response.data);
      } catch (error) {
        console.error("Error in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const items = allUsers
    .filter((i) => i?._id !== userId)
    .map((i) => ({
      key: i?._id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
          onClick={() => {
            onSelectUser(i?._id);
            if (sendFunction) sendFunction(i?._id);
          }}
        >
          <Avatar
            size={60}
            src={i?.profile_picture || "/img-pack/icons/user-blacktheme.png"}
          />
          <div>
            <strong>
              {i?.name} {i?.last_name || ""}
            </strong>
            <div style={{ fontSize: "12px", color: "#888" }}>{i?.role}</div>
          </div>
        </div>
      ),
    }));
  return (
    <Spin spinning={loading}>
      <Dropdown menu={{ items }}>
        <Button onClick={(e) => e.preventDefault()}>{message}</Button>
      </Dropdown>
    </Spin>
  );
};

export default InviteUser;
