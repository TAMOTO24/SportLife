import { Form, Input, Button, Select, DatePicker, Card, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { createNotification } from "../../function";

const { TextArea } = Input;
const { Option } = Select;

const SubscriptionSection = () => {
  const [form] = Form.useForm();
  const onFinishEmail = async (values) => {
    try {
      const res = await axios.post("/send-newsletter", values);
      form.resetFields();
      message.success(res.data.message || "Розсилку відправлено!");
    } catch (err) {
      message.error(err.response?.data?.message || "Помилка при відправці");
    }
  };
  const onFinishNotification = async (values) => {
    try {

      createNotification(
        values.message,
        values.title,
        values.type,
        "",
        "",
        "",
        "",
        "all"
      );

      message.success("Повідомлення успішно надіслано!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Помилка направлення повідомлення!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "5vw" }}>
      <Card
        title="Розсилка повідомлень усім користувачам"
        style={{ width: "100%" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinishNotification}
          initialValues={{
            date: dayjs(),
            type: "info",
          }}
        >
          <Form.Item
            label="Заголовок"
            name="title"
            rules={[{ required: true, message: "Введіть заголовок" }]}
          >
            <Input placeholder="Введіть заголовок сповіщення" />
          </Form.Item>

          <Form.Item
            label="Повідомлення"
            name="message"
            rules={[{ required: true, message: "Введіть текст повідомлення" }]}
          >
            <TextArea rows={4} placeholder="Введіть текст сповіщення" />
          </Form.Item>

          <Form.Item label="Дата уведомления" name="date">
            <DatePicker showTime disabled={true} />
          </Form.Item>

          <Form.Item
            label="Тип сповіщення"
            name="type"
            rules={[{ required: true, message: "Оберіть тип" }]}
          >
            <Select>
              <Option value="success">✅ Успіх</Option>
              <Option value="info">ℹ️ Інформація</Option>
              <Option value="warning">⚠️ Попередження</Option>
              <Option value="error">❌ Помилка</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Надіслати сповіщення
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Відправити розсилку пошти" style={{ width: "100%" }}>
        <Form layout="vertical" onFinish={onFinishEmail}>
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
      </Card>
    </div>
  );
};

export default SubscriptionSection;
