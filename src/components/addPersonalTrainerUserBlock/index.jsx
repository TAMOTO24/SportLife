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
  Avatar,
  Descriptions,
  Card,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { createNotification } from "../../function";
import InviteUser from "../addInviteUserElement";
import "./style.css";
import axios from "axios";

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const PersonalTrainer_User = ({ user, trainer }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const [chosenUser, setChosenUser] = useState(undefined);
  const [chosenUserData, setChosenUserData] = useState(undefined);

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
  const fetchUserDataId = async (id) => {
    axios
      .get(`/userbyid/${id}`)
      .then((response) => setChosenUserData(response.data))
      .catch((error) => console.error(error));
  };
  return (
    <>
      <h1>
        <b>Персональний тренер</b>
      </h1>

      {!user?.personalTrainerId ? (
        <Result
          status="404"
          title="У вас ще немає персонального тренера"
          subTitle="
    Для запису на персонального тренера 
    заповніть форму, де треба обрати самого тренера та заповнити дані, 
    після цього почекати, поки тренер прийме запит!
    "
          extra={
            <Button type="primary" key="console" onClick={showDrawer}>
              Надіслати запрошення
            </Button>
          }
        >
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />
            Заявка не подана, подайте, будь ласка, заявку
          </Paragraph>
        </Result>
      ) : (
        trainer && (
          <Card
            title="Ваш персональний тренер"
            style={{ marginTop: 24, maxWidth: 600 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar
                size={80}
                src={trainer.profile_picture}
                alt={`${trainer.name} ${trainer.last_name}`}
              />
              <Descriptions column={1} style={{ flex: 1, marginLeft: 16 }}>
                <Descriptions.Item label="Ім’я">
                  {trainer.name} {trainer.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Ел. пошта">
                  {trainer.email}
                </Descriptions.Item>
                <Descriptions.Item label="Телефон">
                  {trainer.phone || "Немає"}
                </Descriptions.Item>
                <Descriptions.Item label="Про тренера">
                  {trainer.profileDescription || "—"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        )
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
                fetchUserDataId(id);
              }}
            />
            {chosenUserData && (
              <Card
                title="Інформація про користувача"
                style={{ maxWidth: 600, marginTop: 24 }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Avatar
                    size={80}
                    src={chosenUserData.profile_picture}
                    alt={`${chosenUserData.name} ${chosenUserData.last_name}`}
                  />
                  <div style={{ flex: 1 }}>
                    <Descriptions column={1}>
                      <Descriptions.Item label="Ім’я">
                        {chosenUserData.name} {chosenUserData.last_name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {chosenUserData.email}
                      </Descriptions.Item>
                      <Descriptions.Item label="Телефон">
                        {chosenUserData.phone || "Немає"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Роль">
                        {chosenUserData.role}
                      </Descriptions.Item>
                      {chosenUserData.profileDescription && (
                        <Descriptions.Item label="Опис">
                          {chosenUserData.profileDescription}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </div>
                </div>
              </Card>
            )}
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
