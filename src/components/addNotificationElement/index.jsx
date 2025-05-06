import React, {useState} from "react";
import { Avatar, Badge, Drawer } from "antd";
import "./style.css";

const NotificationElement = () => {
  const [open, setOpen] = useState(false);
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
        count={99}
        overflowCount={10}
        style={{
          boxShadow: "none",
          border: "none",
          fontSize: "15px",
        }}
      >
        <Avatar size={40} src="/img-pack/icons/bell.png" onClick={showDrawer} className="notification"/>
      </Badge>
      <Drawer onClose={onClose} closable={false} open={open}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};

export default NotificationElement;
