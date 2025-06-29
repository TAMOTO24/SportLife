import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Form,
  Input,
  Upload,
  Button,
  message,
  Row,
  Col,
  Space,
  Tag,
  Modal,
} from "antd";
import {
  MailOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Loading from "../addLoadingElement";
import { uploadFileToCloudinary } from "../../uploadFile";

const AccountInfoSection = () => {
  const [form] = Form.useForm();
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const [uploadFile, setUploadedFile] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/currentuserdata");
        setUser(response.data.user);
      } catch (error) {
        console.log("User data recieving error - ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Photo can't be more than 2MB!");
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadedPhoto(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
    return false;
  };

  if (loading) {
    return <Loading />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`/user/${user?._id}/password`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Пароль успішно змінено");
    } catch (err) {
      message.error(err.response?.data?.message || "Помилка при зміні пароля");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    // main handlesubmit that saves files using api construct and create post in MongoDB
    // if (images.length === 0) return message.error("Please upload at least one image.");
    const data = {
      id: user?._id,
      username: values?.username,
      name: values?.name,
      lastname: values?.last_name,
      email: values?.email,
      phone: values?.phone,
      profileDescription: values?.profileDescription,
    };
    if (uploadFile) {
      setLoading(true);
      data.picture =
        uploadFile === "delete"
          ? ""
          : await uploadFileToCloudinary(uploadFile?.file);
    }
    try {
      const response = await axios.patch("/updateuser", data);
      message.success("Профіль змінено успішно!");

      if (setUser) {
        setUser(response.data);
      } else {
        window.location.reload();
      }
    } catch (error) {
      message.error("There are some problems!");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        <Card
          title="Інформація аккаунту"
          style={{ marginBlock: "15px", padding: "10px", flex: 1 }}
          loading={loading}
        >
          <Row gutter={[20, 20]}>
            <Col
              span={3}
              style={{ textAlign: "center", alignContent: "center" }}
            >
              <Avatar
                size={150}
                src={
                  uploadedPhoto
                    ? (uploadFile !== "delete" && uploadedPhoto) ||
                      "/img-pack/icons/user-blacktheme.png"
                    : user.profile_picture ||
                      "/img-pack/icons/user-blacktheme.png"
                }
              />
            </Col>
            <Col span={3}>
              <Space direction="horizontal" size={8}>
                <Space direction="vertical" size={8} style={{ width: "300px" }}>
                  <h2>{user?.username}</h2>
                  <p>
                    <b>Пошта: </b>
                    {user?.email}
                  </p>
                  <p>
                    <b>ФІО: </b>
                    {user?.name} {user?.last_name}
                  </p>
                  <p>
                    <b>Опис профілю: </b>
                    {user?.profileDescription}
                  </p>
                  <p>
                    <b>Роль: </b>
                    <Tag color="blue" bordered={false}>
                      {user.role}
                    </Tag>
                  </p>
                </Space>
                <Upload
                  name="file"
                  maxCount={1}
                  beforeUpload={beforeUpload}
                  showUploadList={{ showRemoveIcon: false }}
                  onChange={(e) => {
                    setUploadedFile(e);
                  }}
                >
                  <Button icon={<EditOutlined />}>Змінити фото профілю</Button>
                </Upload>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    setUploadedFile("delete");
                    setUploadedPhoto("/img-pack/icons/user-blacktheme.png");
                    console.log("awdawdawdw", uploadedPhoto, "awdawd");
                  }}
                >
                  Видалити
                </Button>
                <Button type="primary" onClick={() => setPreviewOpen(true)}>
                  Попередній перегляд
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card
          title="Зміна пароля"
          style={{
            maxWidth: 800,
            marginBlock: "15px",
            padding: "10px",
            flex: 1,
          }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Старий пароль"
              name="oldPassword"
              rules={[{ required: true, message: "Введіть старий пароль" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Новий пароль"
              name="newPassword"
              rules={[{ required: true, message: "Введіть новий пароль" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Підтвердження нового пароля"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Підтвердіть новий пароль" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Паролі не співпадають");
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Змінити пароль
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Card title="Edit">
        <Form
          form={form}
          layout="vertical"
          initialValues={user}
          onFinish={handleSubmit}
          loading={loading}
        >
          <Form.Item name="name" label="Ім'я">
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="last_name" label="Фамілія">
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item name="username" label="Нікнейм">
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="email" label="Почта">
            <Input prefix={<MailOutlined />} placeholder="Email address" />
          </Form.Item>
          <Form.Item name="phone" label="Телефон">
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="profileDescription"
            label="Опис профілю"
            rules={[
              {
                message: "Будь ласка, введіть опис вашого профілю!",
              },
            ]}
          >
            <Input.TextArea placeholder="Скажіть нам про себе..." rows={4} />
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Col>
                <Space size={10}>
                  <Button type="primary" htmlType="submit">
                    Зберегти
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
          width={"60%"}
        >
          <img
            src={uploadedPhoto || user.profile_picture}
            alt="Profile"
            style={{ width: "99%" }}
          />
        </Modal>
      </Card>
    </>
  );
};

export default AccountInfoSection;
