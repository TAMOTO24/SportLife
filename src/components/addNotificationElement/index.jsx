import React, { useEffect, useState, useRef } from "react";
import { Avatar, Badge, Drawer, Space, Button } from "antd";
import {
  Notification,
  deleteNotification,
  setInvitedRoomId,
  trainerRequest,
} from "../../function";
import axios from "axios";
import dayjs from "dayjs";
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

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`/allnotifications/${user._id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Notification error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await axios.get(`/notification/${user._id}`);
        const data = res.data;

        if (data && data.title) {
          await axios.put(`/notification/${user._id}`, {
            notificationId: data._id,
          });
          Notification(
            data.message,
            data.title,
            data.type,
            data._id,
            data.url,
            data?.action
          );
        }
      } catch (error) {
        console.error("Notification error", error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user]);

  const showDrawer = () => {
    fetchNotifications();
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Avatar
        size={40}
        src="/img-pack/icons/bell.png"
        onClick={showDrawer}
        className="notification"
      />
      <Drawer
        onClose={onClose}
        closable={false}
        open={open}
        loading={loading}
        width={640}
        bodyStyle={{ padding: 0, backgroundColor: "rgb(24, 26, 29)" }}
      >
        {notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <Avatar
              size={60}
              src={notification.avatar || "/img-pack/icons/user.png"}
            />
            <div className="notification-content">
              <div className="notification-header">
                <h2>{notification.title}</h2>
                <div>{`${dayjs(notification.date).format("HH:mm")} | ${dayjs(
                  notification.date
                ).format("DD.MM")}`}</div>
              </div>

              <p
                style={{
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {notification.message}
              </p>
              {notification?.action && (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      if (notification?.action === "personalTrainerRequest")
                        trainerRequest(
                          notification?.fromWho,
                          notification?.access,
                          "reject"
                        );
                      setOpen(false);
                      setLoading(true);

                      fetchNotifications();
                      deleteNotification(notification?._id);
                    }}
                  >
                    Відхилити
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      if (notification?.action === "roomRequest")
                        setInvitedRoomId(notification?.url);
                      else if (
                        notification?.action === "personalTrainerRequest"
                      )
                        trainerRequest(
                          notification?.fromWho,
                          notification?.access,
                          "accept"
                        );
                      console.log(notification);
                      fetchNotifications();
                      deleteNotification(notification?._id);
                    }}
                  >
                    Підтвердити
                  </Button>
                </Space>
              )}
            </div>
          </div>
        ))}
      </Drawer>
    </>
  );
};

export default NotificationElement;
