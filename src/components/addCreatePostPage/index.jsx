import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Image, Divider, message } from "antd";
import { PictureFilled, InboxOutlined } from "@ant-design/icons";
import "./style.css";
import axios from "axios";

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); //Saves uploaded files to use them in axios upload api
  const [files, setFile] = useState([]); // Saves url's to files to show them in gallery of chosen files to create post
  const [postData, setPostData] = useState({
    filePaths: [],
    description: "",
  });

  useEffect(() => {
    if (!postData.description) return;
    if (!postData.filePaths) return;
    axios
      .post("/createpagepost", postData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.error("Auth error", error));
  }, [postData]);

  const handleSave = async (file) => {
    if (!file) return message.error("Please upload an image!");
    if (images.length >= 2)
      return message.error("You can upload up to 2 images!");

    setFile((prevImages) => [...prevImages, file]);

    const reader = new FileReader();
    reader.onloadend = () => {
      // Fill array of images to show up in gallery
      const imageUrl = reader.result;
      setImages((prevImages) => [...prevImages, imageUrl]); // add this URL to array
    };
    reader.readAsDataURL(file); // make file readable as a URL
  };

  const handleSubmit = async (values) => {
    // main handlesubmit that saves files using api construct and create post in MongoDB
    // if (images.length === 0) return message.error("Please upload at least one image.");
    if (!values.description)
      return message.error("Please write some text in description.");

    const formData = new FormData();
    files.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      // api to ave files(images) to special folder
      setLoading(true);
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // message.success("Images uploaded successfully!");
      setPostData({
        filePaths: response.data.filePaths,
        description: values.description,
      });
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

          <Form.Item name="galleryPic">
            <Upload
              name="file"
              listType="picture"
              showUploadList={false}
              beforeUpload={(file) => {
                handleSave(file);
                return false;
              }}
            >
              <Button
                block
                icon={<PictureFilled />}
                style={{ width: "50px", borderRadius: "8px", height: "50px" }}
              />
            </Upload>
          </Form.Item>
          <Form.Item label="Dragger">
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              // getValueFromEvent={normFile}
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

        <div className="image-preview">
          {/* Image preview container */}
          {images.map((src, index) => (
            <Image key={index} width={200} src={src} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
