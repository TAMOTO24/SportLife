import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Spin
        tip="Loading..."
        indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
      />
    </div>
  );
};

export default Loading;
