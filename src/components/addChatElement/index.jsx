// ChatElement.jsx — исправленная версия
import { useEffect, useState, useRef } from "react";
import {
  FloatButton,
  Drawer,
  Avatar,
  Divider,
  Input,
  Form,
  notification,
} from "antd";
import {
  MessageOutlined,
  CustomerServiceOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { socket } from "../../function.js";
import dayjs from "dayjs";
import InviteUser from "../addInviteUserElement/index.jsx";
import "./style.css";

export default function ChatElement() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(undefined);
  const [activeChatId, setActiveChatId] = useState(undefined);
  const [currentChat, setCurrentChat] = useState();
  const [users, setUsers] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const allChats = useRef([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/currentuserdata");
        setUser(response.data.user);
        if (!activeChatId) setActiveChatId(response.data.user?.chats[0]);
      } catch (error) {
        console.log("User data receiving error - ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/allusers");
        setUsers(res.data);
      } catch (err) {
        console.log("Error receiving users ", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!user || !currentChat) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_chat", { userId: user?._id, chatId: currentChat?._id });

    const handleReceiveMessage = (message) => {
      if (!open && message.fromId !== user._id) {
        const foundUser = users.find((i) => i._id === message.fromId);
        const key = `msg_${Date.now()}`;
        notification.open({
          description: `@${foundUser.username} : ${message.message}`,
          key,
          duration: 7,
        });
      }
      setCurrentChat((prevChat) => {
        if (!prevChat) return prevChat;

        const alreadyExists = prevChat.history.some(
          (msg) => msg.date === message.date
        );
        if (alreadyExists) return prevChat;

        return {
          ...prevChat,
          history: [...prevChat.history, message],
        };
      });
    };
    socket.on("receive_message", handleReceiveMessage);

    socket.on("update_chats", ({ newChat }) => {
      allChats.current = [...allChats.current, newChat];
      onChanging(user?._id, activeChatId, true);
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("update_chats");
      socket.off("changeChat");
    };
  }, [user, currentChat, open, users]);

  const onChanging = (userId = "", id = "", re = false) => {
    if (!allChats.current || !activeChatId) return;
    const target = [userId || user?._id, id || activeChatId];

    const chat = allChats.current.find(
      (c) =>
        c.chating.length === 2 && target.every((id) => c.chating.includes(id))
    );
    if (re) {
      socket.emit("recconnect", { old: currentChat._id, newRoom: chat._id });
    }
    setCurrentChat(chat);
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get(`/getallchats`);
        allChats.current = response.data;

        if (!currentChat) onChanging();
      } catch (error) {
        console.log("Chat data receiving error - ", error);
      }
    };
    fetchChatData();
    console.log("FUNCTION TRIGGERET")
    setTrigger(false);
  }, [user, activeChatId, trigger]);

  const onFinish = (values) => {
    socket.emit("send_message", {
      chatId: currentChat?._id,
      message: values.message,
      date: dayjs().unix(),
      fromId: user?._id,
    });
    socket.emit("save_chat", {
      chatId: currentChat._id,
      message: values.message,
      date: dayjs().unix(),
      fromId: user._id,
    });
    form.resetFields();
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.submit();
    }
  };

  const changeChat = async (id, change = false) => {
    if (activeChatId === id) return;

    setTrigger(true);

    if (change) onChanging(user?._id, id, true);

    if (!user?.chats.includes(id)) {
      setUser((prevData) => ({
        ...prevData,
        chats: prevData?.chats ? [...prevData.chats, id] : [id],
      }));
    }
    setActiveChatId(id);
  };

  return (
    <>
      <FloatButton.Group
        trigger="click"
        style={{ insetInlineEnd: 24 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton icon={<MessageOutlined />} onClick={() => setOpen(true)} />
        <FloatButton.BackTop />
      </FloatButton.Group>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          if (socket.connected)
            socket.emit("save_chat", {
              history: currentChat.history,
              chatId: currentChat._id,
            });
        }}
        placement="bottom"
        height={1000}
        closable={true}
        styles={{ body: { backgroundColor: "#f9f9f9" } }}
      >
        <div className="chat">
          <div>
            {user?.chats.map((id, index) => {
              const foundUser = users.find((user) => user._id === id);
              if (!foundUser) return null;
              return (
                <div
                  key={id}
                  className={`userAvatar ${
                    currentChat?.chating.includes(id) ? "active" : ""
                  }`}
                  onClick={() => changeChat(id, true)}
                >
                  <Avatar
                    size={64}
                    src={
                      foundUser?.profile_picture ||
                      "/img-pack/icons/user-blacktheme.png"
                    }
                  />
                  <div>{foundUser?.username}</div>
                </div>
              );
            })}
            <div className="userAvatar">
              <InviteUser
                userId={user?._id}
                message={"Додати"}
                onSelectUser={(id) => {
                  socket.emit("new_chat", {
                    firstUser: user?._id,
                    secondUser: id,
                    oldId: currentChat._id,
                  });
                  changeChat(id);
                }}
              >
                <Avatar size={64} icon={<UserAddOutlined />} />
                <Divider />
              </InviteUser>
            </div>
          </div>

          <div className="chatBlock">
            <div className="chat-history">
              {socket.connected ? (
                currentChat && currentChat.history.length > 0 ? (
                  currentChat.history.map((item) => {
                    const isMyMessage = item.fromId === user?._id;
                    const foundUser = users.find((i) => i._id === item.fromId);

                    return (
                      <div
                        key={item._id}
                        style={{
                          alignSelf: isMyMessage ? "flex-end" : "flex-start",
                          backgroundColor: isMyMessage ? "#d0f0c0" : "#fff",
                        }}
                        className="chat-message"
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            marginBottom: 4,
                            color: "#333",
                          }}
                        >
                          {isMyMessage ? "Ви" : foundUser?.username}
                        </div>
                        <div style={{ fontSize: "15px", color: "#000" }}>
                          {item.message}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            textAlign: "right",
                            marginTop: 4,
                            color: "#888",
                          }}
                        >
                          {new Date(item.date * 1000).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: 20,
                      fontStyle: "italic",
                    }}
                  >
                    Тут поки немає повідомлень. Напишіть перше! 📝
                  </div>
                )
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#888",
                    marginTop: 20,
                    fontStyle: "italic",
                  }}
                >
                  Відсутнє підключення до сервера
                </div>
              )}
            </div>

            <Form
              layout="horizontal"
              form={form}
              onFinish={onFinish}
              style={{ marginTop: 12 }}
            >
              <Form.Item name="message" style={{ marginBottom: 0 }}>
                <Input.TextArea
                  rows={2}
                  placeholder="Введіть повідомлення"
                  onKeyDown={onKeyDown}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{
                    borderRadius: 20,
                    padding: "10px 14px",
                    marginBottom: 15,
                    resize: "none",
                    fontSize: 14,
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Drawer>
    </>
  );
}
