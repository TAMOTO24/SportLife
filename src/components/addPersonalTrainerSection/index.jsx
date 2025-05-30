import { useState } from "react";
import { Drawer, Button, Result, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./style.css";

const { Paragraph, Text } = Typography;

const PersonalTrainer = ({ user }) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

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
        <h2>Ваш персональний тренер</h2>
        <p>Інформація про тренування, цілі, прогрес і т.д.</p>
      </Drawer>
    </>
  );
};

export default PersonalTrainer;
