import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Typography,
  message,
  Image,
  List,
  Popconfirm,
} from "antd";
import { useParams, useNavigate  } from "react-router-dom";
import Loading from "../addLoadingElement"

const { TextArea } = Input;
const { Title } = Typography;

const EditPost = () => {
  const [form] = Form.useForm();
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/post/${postId}`).then((res) => {
      const data = res.data;
      setInitialData(data);
      setGallery(data.gallery);

      form.setFieldsValue({
        text: data.text,
        date: dayjs(data.date),
        gallery: data.gallery.join("\n"),
        like: data.like.join("\n"),
        created_by: data.created_by,
      });

      setLoading(false);
    });
  }, [postId, form]);

  const onFinish = async (values) => {
    const updatedPost = {
      ...initialData,
      text: values.text,
      date: values.date.toISOString(),
      gallery: gallery,
      like: values.like.split("\n").filter(Boolean),
      created_by: values.created_by,
    };

    try {
      await axios.put(`/post/${postId}`, updatedPost);
      message.success("Пост оновлено успішно!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      message.error("Помилка під час оновлення поста");
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      style={{
        width: "30vw",
        background: "#ffffff",
        borderRadius: "15px",
        margin: "10vh auto",
        padding: "20px"
      }}
    >
      <Title level={3}>Редагувати пост</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Текст"
          name="text"
          rules={[{ required: true, message: "Введіть текст поста" }]}
        >
          <TextArea rows={4} placeholder="Введіть текст поста..." />
        </Form.Item>

        <Form.Item
          label="Дата"
          name="date"
          rules={[{ required: true, message: "Оберіть дату" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Галерея зображень">
          {gallery.length === 0 ? (
            <p>Немає зображень</p>
          ) : (
            <List
              bordered
              dataSource={gallery}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="Видалити це зображення?"
                      onConfirm={() => {
                        setGallery((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      okText="Так"
                      cancelText="Ні"
                    >
                      <Button danger size="small">
                        Видалити
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Image
                    src={item}
                    alt={`Зображення ${index + 1}`}
                    width={100}
                  />
                </List.Item>
              )}
            />
          )}
        </Form.Item>

        <Form.Item
          label="ID користувачів, які лайкнули (по одному на рядок)"
          name="like"
        >
          <TextArea rows={2} placeholder="681d3606f53a0544ec76dbef" />
        </Form.Item>

        <Form.Item label="Автор поста (ID)" name="created_by">
          <Input disabled />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Зберегти зміни
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPost;
