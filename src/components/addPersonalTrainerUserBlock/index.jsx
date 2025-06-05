import { useState } from "react";
import {
  Drawer,
  Button,
  Result,
  Typography,
  Input,
  Form,
  Tag,
  message,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { createNotification } from "../../function";
import InviteUser from "../addInviteUserElement";
import "./style.css";

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const PersonalTrainer_User = ({ user }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const [chosenUser, setChosenUser] = useState(undefined);

  const handleSubmit = (values) => {
    console.log("in and ", chosenUser, user);
    if (!chosenUser) {
      console.log("error");
      message.error("Щось пішло не так спробуйте ще раз через декілька секунд");
      return;
    }
    form.resetFields();
    createNotification(
      values.note,
      "Прохання на тему персонального тренера.",
      "info",
      chosenUser,
      user._id,
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
          subTitle="
          Для запису на персонального тренеру 
          заповніть форму де треба обрати самого тренера та заповнити дані, 
          після цього почекати поки тренер приймє запит!
          "
          extra={
            <Button type="primary" key="console" onClick={showDrawer}>
              Надіслати запрошення
            </Button>
          }
        >
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />
            Заявка не подана, подайте будь-ласка заявку
          </Paragraph>
        </Result>
      )}
      <div>
        Статус запиту{" "}
        {user?.personalTrainerId === "rejected" ? (
          <Tag bordered={false} color="error" style={{ fontSize: 20 }}>
            Відхилено
          </Tag>
        ) : user?.personalTrainerId === undefined ||
          user?.personalTrainerId === null ? (
          <Tag bordered={false} color="default" style={{ fontSize: 20 }}>
            Ви ще не відправили запит!
          </Tag>
        ) : (
          <Tag bordered={false} color="success" style={{ fontSize: 20 }}>
            Підтверджено
          </Tag>
        )}
      </div>
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
              onlyTrainer={true}
              onSelectUser={(id) => {
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

export default PersonalTrainer_User;
