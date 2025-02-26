import React, { useState } from "react";
import { Form, Input, Button, Upload, Image, Divider, message } from "antd";
import { PictureFilled } from "@ant-design/icons";
import "./style.css";
import axios from "axios";

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [files, setFile] = useState([]);

  const handleSave = async (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5; // Check file size
    if (!isLt5M) return message.error("Image must smaller than 5MB!");
    if (!file) return message.error("Please upload an image!");
    if (images.length >= 2) return message.error("You can upload up to 2 images!");

    // const formData = new FormData();
    // formData.append("image", file);

    setFile((prevImages) => [...prevImages, file]);

    const reader = new FileReader();
    reader.onloadend = () => { //Fill array of images to show up in gallery
      const imageUrl = reader.result;
      setImages((prevImages) => [...prevImages, imageUrl]);
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async () => {
    if (images.length === 0) return message.error("Please upload at least one image.");

    const formData = new FormData();
    files.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      setLoading(true);
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Images uploaded successfully!");
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
        >
          <Form.Item
            name="profileDescription"
            label="Profile Description"
            rules={[
              {
                required: true,
                message: "Please enter your description!",
              },
            ]}
          >
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

          <Form.Item>
            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleSubmit}
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
