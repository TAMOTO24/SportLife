import React, { useEffect } from "react";
import "./style.css";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Form, Input, Select, Card, Upload, Button, Space, Tag } from "antd";
import Axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const RoleConfigurationSection = ({ user }) => {
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    console.log("FileList:", e?.fileList);
    return e?.fileList;
  };
  
  return (
    <div className="roleConfigurationSection">
      <div className="roleConfigurationBlock">
        <Card title="Role Configuration" className="roleConfigurationCard">
          <Form
            layout="vertical"
            className="roleConfigurationForm"
            initialValues={{ email: user.email }}
          >
            <Form.Item name="note" label="Note" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a option and change input text above">
                <Option value="trainer">request Trainer role</Option>
                <Option value="admin">request Admin role</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              disable
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="upload" valuePropName="fileList"></Form.Item>

            <Form.Item label="Dragger">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button">Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div className="roleConfigurationBlock">
        <Card>
          <h1>
            <b>Current Role:</b>{" "}
            <Tag color="blue" style={{ fontSize: "20px" }}>
              {user.role}
            </Tag>
          </h1>
          <p>
            If you want to change your role, please fill out the form on the
            left and submit your request.
          </p>
          <p>
            Your current role is <b className="roleText">{user.role}</b>. If you
            need to change it, please contact support.
          </p>
          <h3>
            <b>Available Roles:</b>
          </h3>
          <ul>
            <li>
              <Tag color="green">Trainer</Tag>
            </li>
            <li>
              <Tag color="orange">Admin</Tag>
            </li>
          </ul>
          {user?.trainerRequestId && (
            <div>
              <h2>Current Status</h2>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RoleConfigurationSection;
