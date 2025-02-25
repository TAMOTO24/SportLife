import React, { useState } from "react";
import { Form, Input, Button, Upload, Image, Divider } from "antd";
import { PictureFilled } from "@ant-design/icons";
import "./style.css";

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const handleUpload = (info) => {
    const file = info.file;
    const reader = new FileReader();

    reader.onload = () => {
      setImages((prevImages) => [...prevImages, reader.result]);
    };

    reader.readAsDataURL(file);
    return false; 
  };

  return (
    <div className="createPostPage">
      <div className="createPostForm">
        <Form layout="vertical" style={{ width: "800px" }}>
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
              beforeUpload={handleUpload}
            >
              <Button
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

        <div className="image-preview"> {/* Image preview container */}
          {images.map((src, index) => (
            <Image key={index} width={200} src={src} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
