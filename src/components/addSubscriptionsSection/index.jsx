import { Form, Input, Button, message } from "antd";
import axios from "axios";

const { TextArea } = Input;

const SubscriptionSection = () => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const res = await axios.post("/send-newsletter", values);
      form.resetFields();
      message.success(res.data.message || "Розсилку відправлено!");
    } catch (err) {
      message.error(err.response?.data?.message || "Помилка при відправці");
    }
  };

  return (
    <div>
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <h2 style={{ textAlign: "center" }}>Відправити розсилку</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Тема листа"
            name="subject"
            rules={[{ required: true, message: "Введіть тему" }]}
          >
            <Input placeholder="Наприклад: Новини SportLife" />
          </Form.Item>
          <Form.Item
            label="Текст повідомлення"
            name="message"
            rules={[{ required: true, message: "Введіть повідомлення" }]}
          >
            <TextArea rows={6} placeholder="Тут текст листа..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Надіслати всім підписникам
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SubscriptionSection;
