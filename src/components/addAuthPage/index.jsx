import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  Upload,
  Checkbox,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./style.css";
import AuthContext from "../../authprovider.js";

const { Option } = Select;

const AuthPage = () => {
  const [form] = Form.useForm();
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState("signin");

  const phonePrefixes = Array.from({ length: 999 }, (_, i) => {
    const value = i + 1;
    return (
      <Option key={value} value={value}>
        +{value}
      </Option>
    );
  });

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>{phonePrefixes}</Select>
    </Form.Item>
  );

  useEffect(() => {
    const existingToken = Cookies.get("token");
    if (existingToken) {
      navigate("/");
    }
    setEmail(searchParams.get("email"));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    if (authType === "signin") {
      try {
        await login(values.email, values.password, navigate, message);
      } catch (err) {
        message.error("Помилка під час входу.");
      }
    } else {
      try {
        await signup(
          values.email,
          values.username,
          values.name,
          values.lastname,
          values.password,
          values.prefix + values.phone,
          "path",
          values.gender,
          "user",
          navigate,
          message
        );
      } catch (err) {
        message.error("Помилка під час реєстрації.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="auth-container">
        <div>
          <div style={{ textAlign: "center" }}>
            <h1>{authType !== "signup" ? "Вхід" : "Реєстрація"}</h1>
          </div>
          <Form
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ email: searchParams.get("email") }}
            style={{ width: "600px" }}
          >
            {authType === "signup" && (
              <>
                <Form.Item
                  label="Нікнейм"
                  name="username"
                  tooltip="Ім'я, яке будуть бачити інші користувачі"
                  rules={[
                    {
                      required: true,
                      message: "Введіть нікнейм!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Нікнейм" />
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Ім'я"
                  rules={[
                    {
                      required: true,
                      message: "Введіть ім’я!",
                    },
                  ]}
                >
                  <Input placeholder="Ім’я" />
                </Form.Item>
                <Form.Item
                  name="lastname"
                  label="Прізвище"
                  rules={[
                    {
                      required: true,
                      message: "Введіть прізвище!",
                    },
                  ]}
                >
                  <Input placeholder="Прізвище" />
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Електронна пошта"
              name="email"
              rules={[
                { required: true, message: "Введіть електронну пошту!" },
                { type: "email", message: "Невірний формат пошти!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: "Введіть пароль!" },
                { min: 6, message: "Пароль має бути не менше 6 символів!" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>

            {authType === "signup" && (
              <>
                <Form.Item
                  label="Підтвердіть пароль"
                  name="password2"
                  tooltip="Введіть пароль повторно"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Підтвердіть пароль!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Паролі не співпадають!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Пароль ще раз" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Номер телефону"
                  rules={[
                    {
                      required: true,
                      message: "Введіть номер телефону!",
                    },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    placeholder="Номер телефону"
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Стать"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Оберіть стать">
                    <Option value="male">Чоловіча</Option>
                    <Option value="female">Жіноча</Option>
                    <Option value="other">Інше</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Потрібно прийняти умови")
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    Я ознайомлений з <a href="">угодою</a>
                  </Checkbox>
                </Form.Item>
              </>
            )}

            <Button
              type={authType === "signin" ? "primary" : "default"}
              block
              htmlType="submit"
              loading={loading}
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              {authType === "signin" ? "Увійти" : "Зареєструватися"}
            </Button>
          </Form>

          <p style={{ marginTop: 10, textAlign: "center" }}>
            {authType === "signin"
              ? "Ще не маєте облікового запису?"
              : "Вже маєте обліковий запис?"}{" "}
            <a
              href="#"
              onClick={() =>
                setAuthType(authType === "signin" ? "signup" : "signin")
              }
            >
              {authType === "signin" ? "Реєстрація" : "Вхід"}
            </a>
          </p>
        </div>

        <div>
          <p style={{ marginTop: 20, fontSize: 12, textAlign: "center" }}>
            <Link to="/authpage">Умови використання</Link> |{" "}
            <Link to="#">Політика конфіденційності</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
