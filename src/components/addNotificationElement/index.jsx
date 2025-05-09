import React, { useEffect, useState } from "react";
import { Avatar, Badge, Drawer, Space, Button } from "antd";
import {
  Notification,
  deleteNotification,
  setInvitedRoomId,
} from "../../function";
import axios from "axios";
import "./style.css";

const NotificationElement = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Get current user data
    setLoading(true);
    axios
      .get("/currentuserdata")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => console.error("Auth error", error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Get all notifications
    if (!user) return;

    const interval = setInterval(async () => {
      setLoading(true);
      axios
        .get(`/allnotifications/${user?._id}`)
        .then((response) => {
          setNotifications(response.data);
          console.log("Notifications:", response.data);
        })
        .catch((error) => console.error("Notification error", error))
        .finally(() => {
          setLoading(false);
        });
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Output notification checking new ones every 10 seconds
    if (!user) return;

    const interval = setInterval(async () => {
      const res = await axios.get(`/notification/${user?._id}`); // find new notifications
      const data = res.data;

      if (!data) return; //if no new notifications then just exit
      if (data.type === "error") return; //if error then just exit
      if (!data.title) return; //if no title then just exit

      await axios.put(`/notification/${user?._id}`, {
        //mark notification as read for this user
        notificationId: data._id,
      });
      console.log("Notification:", data._id);
      Notification(data.message, data.title, data.type, data._id, data.url);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      {/* ADD NOTIFICATION SUPPORT*/}
      <Badge
        dot={true}
        style={{
          boxShadow: "none",
          border: "none",
        }}
        size={"large"}
      >
        <Avatar
          size={40}
          src="/img-pack/icons/bell.png"
          onClick={showDrawer}
          className="notification"
        />
      </Badge>
      <Drawer
        onClose={onClose}
        closable={false}
        open={open}
        loading={loading}
        width={640}
        bodyStyle={{ padding: 0, backgroundColor: "rgb(24, 26, 29)" }}
      >
        {notifications.map((notification) => {
          return (
            <div key={notification._id} className="notification-item">
              <Avatar
                size={60}
                src={notification.avatar || "/img-pack/icons/user.png"}
              />
              <div className="notification-content">
                <div className="notification-header">
                  <h1>{notification.title}</h1>
                  <div>{notification.date}</div>
                </div>
                <p>{notification.message}</p>
              </div>
              {notification.url && (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => deleteNotification(notification?._id)}
                  >
                    Destroy All
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setInvitedRoomId(notification?.url);
                      deleteNotification(notification?._id);
                    }}
                  >
                    Confirm
                  </Button>
                </Space>
              )}
            </div>
          );
        })}
      </Drawer>
    </>
  );
};

export default NotificationElement;
