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
  Image,
  Modal
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
      const url = await uploadFileToCloudinary(uploadFile?.file);
      data.picture = url;
    }
    try {
      const response = await axios.put("/updateuser", data);
      message.success("Profile updated successfully!");

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
      <Card
        title="Account Info"
        style={{ marginBlock: "15px", padding: "10px" }}
        loading={loading}
      >
        <Row gutter={[20, 20]}>
          <Col span={3} style={{ textAlign: "center", alignContent: "center" }}>
            <Avatar
              size={150}
              src={uploadedPhoto ? uploadedPhoto : user.profile_picture}
            />
          </Col>
          <Col span={3}>
            <Space direction="horizontal" size={8}>
              <Space direction="vertical" size={8} style={{ width: "300px" }}>
                <h2>{user?.username}</h2>
                <p>
                  <b>Email: </b>
                  {user?.email}
                </p>
                <p>
                  <b>Full Name: </b>
                  {user?.name} {user?.last_name}
                </p>
                <p>
                  <b>Description: </b>
                  {user?.profileDescription}
                </p>
                <p>
                  <b>Tag: </b>
                  <Tag color="blue" bordered={false}>
                    {user.role}
                  </Tag>
                </p>
              </Space>
              <Upload
                name="file"
                maxCount={1}
                beforeUpload={beforeUpload}
                onChange={(e) => {
                  setUploadedFile(e);
                }}
              >
                <Button icon={<EditOutlined />}>Change Avatar</Button>
              </Upload>
              <Button icon={<DeleteOutlined />} danger>
                Remove
              </Button>
              <Button type="primary"  onClick={() => setPreviewOpen(true)}>Preview</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card title="Edit">
        <Form
          form={form}
          layout="vertical"
          initialValues={user}
          onFinish={handleSubmit}
          loading={loading}
        >
          <Form.Item name="name" label="First Name">
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name">
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item name="username" label="Username">
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input prefix={<MailOutlined />} placeholder="Email address" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number">
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="profileDescription"
            label="Profile Description"
            rules={[
              {
                required: true,
                message: "Please enter your profile description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Tell us about yourself..." rows={4} />
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Col>
                <Space size={10}>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                  {/* <Button htmlType="button">Cancel</Button> */}
                </Space>
              </Col>
              <Col>
                <Button type="primary" danger>
                  Delete
                </Button>
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
