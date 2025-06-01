import React, { useEffect, useState, useRef } from "react";
import { Avatar, Badge, Drawer, Space, Button } from "antd";
import {
  Notification,
  deleteNotification,
  setInvitedRoomId,
  trainerRequest,
} from "../../function";
import axios from "axios";
import "./style.css";

const NotificationElement = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  // const [sender, setSender] = useState(undefined);

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

  // useEffect(() => {
  //   // Get all notifications
  //   if (!user) return;

  //   const interval = setInterval(async () => {
  //     setLoading(true);
  //     axios
  //       .get(`/allnotifications/${user?._id}`)
  //       .then((response) => {
  //         setNotifications(response.data);
  //       })
  //       .catch((error) => console.error("Notification error", error))
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, [user]);

  // useEffect(() => {
  //   // Output notification checking new ones every 10 seconds
  //   if (!user) return;

  //   const interval = setInterval(async () => {
  //     const res = await axios.get(`/notification/${user?._id}`); // find new notifications
  //     const data = res.data;

  //     if (!data) return; //if no new notifications then just exit
  //     if (data.type === "error") return; //if error then just exit
  //     if (!data.title) return; //if no title then just exit

  //     await axios.put(`/notification/${user?._id}`, {
  //       //mark notification as read for this user
  //       notificationId: data._id,
  //     });
  //     console.log("Notification:", data._id);
  //     Notification(
  //       data.message,
  //       data.title,
  //       data.type,
  //       data._id,
  //       data.url,
  //       data?.action
  //     );
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [user]);

  const fetchNotifications = async (isMounted) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.get(`/allnotifications/${user._id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Notification error", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        fetchNotifications(user, setNotifications, setLoading);
      }, 10000);
    }
  };
  useEffect(() => {
    // ! Test new notification function it can contain bugs or errors
    if (!user) return;

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const checkNewNotification = async () => {
      if (!isMounted) return;

      try {
        const res = await axios.get(`/notification/${user._id}`);
        const data = res.data;

        if (data && data.type !== "error" && data.title) {
          await axios.put(`/notification/${user._id}`, {
            notificationId: data._id,
          });
          console.log("Notification:", data._id);
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
      } finally {
        if (isMounted) setTimeout(checkNewNotification, 5000);
      }
    };

    checkNewNotification();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      {/* <Badge
        dot={true}
        style={{
          boxShadow: "none",
          border: "none",
        }}
        size={"large"}
      > */}
      <Avatar
        size={40}
        src="/img-pack/icons/bell.png"
        onClick={showDrawer}
        className="notification"
      />
      {/* </Badge> */}
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
                <div>{notification.date}</div>
              </div>

              <p>{notification.message}</p>
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
