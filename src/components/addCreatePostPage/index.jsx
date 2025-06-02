import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Divider, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { uploadFileToCloudinary } from "../../uploadFile";
import "./style.css";
import axios from "axios";

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const normFile = (e) => {
    console.log("normFile event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleUploadMultiple = async (file) => {
    try {
      const url = await uploadFileToCloudinary(file);
      return url;
    } catch (err) {
      message.error("Помилка при завантаженні деяких файлів");
      throw err;
    }
  };
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

  const handleSubmit = async (values) => {
    // main handlesubmit that saves files using api construct and create post in MongoDB
    // if (images.length === 0) return message.error("Please upload at least one image.");
    if (!values.description)
      return message.error("Please write some text in description.");

    try {
      const urls = await Promise.all(
        values.upload.map((fileWrapper) =>
          handleUploadMultiple(fileWrapper.originFileObj)
        )
      );

      const postData = {
        description: values.description,
        filePaths: urls,
        userId: user?._id
      };

      axios
        .post("/createpagepost", postData)
        .catch((error) => console.error("Auth error", error));
    } catch (error) {
      message.error("Upload error!");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="createPostPage">
      <div className="createPostForm">
        <Form
          layout="vertical"
          style={{ width: "800px" }}
          onFinish={handleSubmit}
        >
          <Form.Item name="description" label="Post Description">
            <Input.TextArea
              placeholder="Have to share something..."
              rows={4}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
          {/* <Form.Item name="upload" valuePropName="fileList" /> */}
          <Form.Item label="Dragger">
            <Form.Item
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger name="files" beforeUpload={() => false} multiple>
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
            <Button
              type="primary"
              block
              loading={loading}
              htmlType="submit"
              style={{
                backgroundColor: "#1890ff",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                padding: "10px 0",
                width: "100%",
              }}
            >
              +
            </Button>
            <Divider>Images</Divider>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreatePostPage;
