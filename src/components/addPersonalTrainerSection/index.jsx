import { useState } from "react";
import { Drawer, Button, Result, Typography, Form, Input, message } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { createNotification } from "../../function";
import InviteUser from "../addInviteUserElement";
import "./style.css";

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const PersonalTrainer = ({ user }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const [chosenUser, setChosenUser] = useState(undefined);

  const handleSubmit = (values) => {
    console.log("Відправлено:", values.note);
    form.resetFields();
    createNotification(
      values.note,
      "Прохання на тему персонального тренера.",
      "info",
      chosenUser,
      user?._id,
      "",
      "personalTrainerRequest"
    );
    message.success("Запрошення надіслано!");
    onClose();
  };

  return (
    <>
      <h1>
        <b>Персональний тренер</b>
      </h1>
      {!user?.personalTrainerId && (
        <Result
          status="404"
          title="У вас ще немає персонального тренеру"
          subTitle="Для запису на персонального тренеру заповніть форму де треба обрати самого тренера та заповнити дані, після цього почекати поки тренер приймє запит!"
          extra={
            <Button type="primary" key="console" onClick={showDrawer}>
              Надіслати запрошення
            </Button>
          }
        >
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The content you submitted has the following error:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
            account has been frozen. <a>Thaw immediately &gt;</a>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
            account is not yet eligible to apply. <a>Apply Unlock &gt;</a>
          </Paragraph>
        </Result>
      )}
      <h2>
        <b>Запит на персонального тренера</b>
      </h2>
      {!user?.personalTrainerId && <></>}
      <Drawer onClose={onClose} closable={false} open={open}>
        <h2 style={{ marginBottom: 8 }}>Ваш персональний тренер</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>
          Інформація про тренування, цілі, прогрес і т.д.
        </p>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Записка"
            name="note"
            rules={[{ required: true, message: "Будь ласка, введіть записку" }]}
          >
            <TextArea
              rows={4}
              placeholder="Наприклад: хочу змінити програму тренувань..."
            />
          </Form.Item>
          <Form.Item>
            <InviteUser
              userId={user?._id}
              message={"Запросити"}
              onSelectUser={(id) => {
                console.log("Вибраний юзер:", id);
                setChosenUser(id);
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Відправити
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default PersonalTrainer;
