import React, { useEffect, useState } from "react";
import "./style.css";
import {
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Card,
  Upload,
  Button,
  Space,
  Tag,
  Spin,
} from "antd";
import Axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const RoleConfigurationSection = ({ user }) => {
  const [form] = Form.useForm();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    if (!user || !user.trainerRequestId) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(`/request/${user?.trainerRequestId}`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("id", user._id);
    formData.append("email", user.email);
    formData.append("subject", values.reason);
    formData.append("note", values.note);

    values.dragger.forEach((fileWrapper) => {
      formData.append("files", fileWrapper.originFileObj);
    });

    try {
      const response = await Axios.post("/sendemail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Request submitted:", response.data);
      form.resetFields();
      setRequests(response.data);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="roleConfigurationSection">
      <div className="roleConfigurationBlock">
        <Card title="Role Configuration" className="roleConfigurationCard">
          <Form
            layout="vertical"
            className="roleConfigurationForm"
            initialValues={{ email: user.email }}
            onFinish={onFinish}
          >
            <p className="roleConfigurationSectionText">
              Запишіть нам причину чому ви хочете стати тренером у нашій
              компанії
            </p>
            <Form.Item name="note" label="Note" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <p className="roleConfigurationSectionText">
              Виберіть роль, яку ви хочете отримати. Якщо ви хочете стати
              тренером, виберіть "Тренер". Якщо ви хочете стати адміністратором,
              виберіть "Адміністратор".
            </p>
            <Form.Item
              name="reason"
              label="Request Reason"
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
              rules={[{ required: true }]}
            >
              <Input disabled={true} />
            </Form.Item>

            <Form.Item name="upload" valuePropName="fileList"></Form.Item>
            <p className="roleConfigurationSectionText">
              Будь ласка, надішліть нам своє резюме або інші документи, які
              підтверджують вашу кваліфікацію. Ви можете завантажити їх тут.
            </p>
            <Form.Item label="Dragger">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger name="files">
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
      <Spin
        indicator={<LoadingOutlined spin />}
        spinning={loading}
        size="small"
      >
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
              Your current role is <b className="roleText">{user.role}</b>. If
              you need to change it, please contact support.
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
                <h1>Request #{user.trainerRequestId}</h1>
                <h3>
                  <b>Status: </b>
                  {requests?.status || "Pending"}
                </h3>
              </div>
            )}
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default RoleConfigurationSection;
