import React, { useEffect, useState } from "react";
import "./style.css";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
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
  message,
} from "antd";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const RoleConfigurationSection = ({ user }) => {
  const [form] = Form.useForm();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

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
        const response = await axios.get(`/request/${user?.trainerRequestId}`);
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
    const selected = JSON.parse(values.request);

    if (!values) return;

    formData.append("id", user._id);
    formData.append("email", user.email);
    formData.append("subject", selected.subject);
    formData.append("note", values.note);
    formData.append("role", selected.role);
    formData.append("userData", JSON.stringify(user));

    if (values.dragger)
      values.dragger.forEach((fileWrapper) => {
        formData.append("files", fileWrapper.originFileObj);
      });

    setLoading(true);
    try {
      const response = await axios.post("/sendemail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Request submitted:", response.data);
      form.resetFields();
      setRequests(response.data);
      message.success("Заявка успішно надіслано! Дякую!");
    } catch (error) {
      message.error(error || "Щось пішло не так, спробуйте ще раз!");
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roleConfigurationSection">
      <Spin spinning={loading}>
        <div className="roleConfigurationBlock">
          <Card title="Конфігурація ролі" className="roleConfigurationCard">
            <Form
              form={form}
              loading={loading}
              layout="vertical"
              className="roleConfigurationForm"
              initialValues={{ email: user.email }}
              onFinish={onFinish}
            >
              <p className="roleConfigurationSectionText">
                Запишіть нам причину чому ви хочете стати тренером у нашій
                компанії
              </p>
              <Form.Item
                name="note"
                label="Записка до звернення"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <p className="roleConfigurationSectionText">
                Виберіть роль, яку ви хочете отримати. Якщо ви хочете стати
                тренером, виберіть "Тренер". Якщо ви хочете стати
                адміністратором, виберіть "Адміністратор".
              </p>
              <Form.Item
                name="request"
                label="Виберіть потрібну роль."
                rules={[{ required: true }]}
              >
                <Select placeholder="Select a option and change input text above">
                  <Option value='{"role":"trainer","subject":"Запит на роль тренер"}'>
                    Запит на роль тренер
                  </Option>
                  <Option value='{"role":"admin","subject":"Запит на роль адміністратор"}'>
                    Запит на роль адміністратор
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="email"
                label="Пошта"
                rules={[{ required: true }]}
              >
                <Input disabled={true} />
              </Form.Item>

              {/* <Form.Item name="upload" valuePropName="fileList"></Form.Item> */}
              <p className="roleConfigurationSectionText">
                Будь ласка, надішліть нам своє резюме або інші документи, які
                підтверджують вашу кваліфікацію. Ви можете завантажити їх тут.
              </p>
              <Form.Item label="Закиньте документами">
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload.Dragger
                    name="files"
                    customRequest={({ onSuccess }) =>
                      setTimeout(() => onSuccess("ok"), 0)
                    }
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Натисніть або перетягніть документи у цю область, щоб
                      завантажити
                    </p>
                    <p className="ant-upload-hint">
                      Підтримка одноразового або масового завантаження.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Spin>
      <Spin
        indicator={<LoadingOutlined spin />}
        spinning={loading}
        size="small"
      >
        <div className="roleConfigurationBlock">
          <Card>
            <h1>
              <b>Ваша роль зараз:</b>{" "}
              <Tag color="blue" style={{ fontSize: "20px" }}>
                {user.role}
              </Tag>
            </h1>
            <p>
              Якщо ви хочете змінити свою роль, будь ласка, заповніть форму
              ліворуч та надішліть свій запит.
            </p>
            <p>
              Ваша роль зараз <b className="roleText">{user.role}</b>. Якщо вам
              потрібно це змінити, зверніться до служби підтримки за допомогою
              форми зліва
            </p>
            <h3>
              <b>Доступні ролі:</b>
            </h3>
            <ul>
              <li>
                <Tag>Користувач - User</Tag>
              </li>
              <li>
                <Tag color="green">Тренер - Trainer</Tag>
              </li>
              <li>
                <Tag color="orange">Адміністратор - Admin</Tag>
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
