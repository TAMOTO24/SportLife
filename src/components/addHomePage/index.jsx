// import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Form, Spin, message } from "antd";
import PostElement from "../addPostElement";
import TrainerCardElement from "../addTrainerCardElement";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

function Home() {
  const [form] = Form.useForm();
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);
  const section4 = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);

  const backgrounds = [
    "url(./img-pack/page1.jpg)",
    "url(./img-pack/page2.jpg)",
    "url(./img-pack/page3.jpg)",
    "url(./img-pack/page4.png)",
  ];
  const dotsCount = backgrounds.length;
  useEffect(() => {
    axios
      .get("/api/getposts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleDotClick = (index) => {
    // Змінити фон при натисканні на точку
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % dotsCount);
    }, 4000);

    return () => clearInterval(interval);
  }, [dotsCount]);

  const scrollTo = (ref) => {
    if (ref.current) {
      const offset = -80; // Відступ від верху сторінки
      const targetPosition =
        ref.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  const onFinish = async (values) => {
    if (!values.mail) return;

    form.resetFields();

    try {
      const res = await axios.post("/subscribe", { email: values.mail });
      message.success(res.data.message || "Ви успішно підписались!");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Щось пішло не так");
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ backgroundColor: "#111111" }}>
        <div className="sectionNav">
          <button onClick={() => scrollTo(section1)}>1</button>
          <button onClick={() => scrollTo(section2)}>2</button>
          <button onClick={() => scrollTo(section3)}>3</button>
          <button onClick={() => scrollTo(section4)}>4</button>
        </div>

        <div
          ref={section1}
          className="section"
          id="FPage"
          style={{ backgroundImage: backgrounds[activeIndex], height: "90vh" }}
        >
          {/*Фон домашньої сторінки з перемикачем*/}
          <div className="page-content">
            <h1>
              <b>Головна</b>
            </h1>
            <div>
              Ласкаво просимо до SportLife — вашого надійного помічника у світі
              спорту та здорового способу життя. Тут ви знайдете індивідуальні
              тренування, професійних тренерів та корисні поради для досягнення
              ваших фітнес-цілей.
              <br /> Приєднуйтесь до нашої спільноти, щоб вдосконалюватися
              щодня!
            </div>
          </div>
          <div className="dots-container">
            {backgrounds.map((_, index) => (
              <div
                key={index}
                className={`dot ${activeIndex === index ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>

        <div className="section" ref={section2}>
          <div
            className="background"
            style={{
              backgroundImage:
                "url(/img-pack/trainers/strong-man-pulling-rope_23-2147671924.jpg)",
            }}
          />
          <div className="blog-section-block">
            <p className="blog-title">Наш блог</p>
            <p className="blog-subtitle">Шукайте новини та публікації</p>
            <div
              style={{ display: "flex", gap: "2%", justifyContent: "center" }}
            >
              {posts.slice(0, 3).map((item) => (
                <PostElement
                  key={item.id}
                  item={item}
                  hoverable={true}
                  theme={false}
                />
              ))}
            </div>
          </div>
        </div>

        <div ref={section3} className="section" style={{ height: "85vh" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingInline: "2%",
              paddingTop: "5%",
            }}
          >
            <div>
              <div className="blog-title">Наша команда</div>
              <div className="blog-subtitle">
                Обирайте тренуватись з експертами, яких бажаєте
              </div>
            </div>
            <Button
              type="primary"
              danger
              ghost
              onClick={() => {
                navigate("/trainerspage");
              }}
              style={{ padding: "2%", fontSize: "100%" }}
            >
              Переглянути усіх наших експертів
            </Button>
          </div>
          <TrainerCardElement />
        </div>

        <div ref={section4} className="section" style={{ height: "50vh" }}>
          <div
            className="background"
            style={{
              backgroundImage:
                "url(/img-pack/trainers/strong-gymnast-guy-rings_144962-1347.jpg)",
            }}
          />
          <div
            className="blog-section-block"
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(227, 84, 73, 0.4)",
            }}
          >
            <p style={{ fontSize: "2rem" }}>
              Введіть вашу електронну пошту, щоб отримувати новини прямо у вашу
              поштову скриньку
            </p>
            <p style={{ fontSize: "5rem" }} id="titleItem">
              Будьте в курсі усіх подій
            </p>
            <Form
              form={form}
              layout="vertical"
              style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="mail"
                rules={[
                  { required: true, message: "Введіть email" },
                  { type: "email", message: "Некоректна email адреса" },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  placeholder="Ваша електронна пошта"
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    padding: "16px",
                  }}
                />
              </Form.Item>

              <Button
                type="ghost"
                htmlType="submit"
                style={{
                  color: "white",
                  border: "1px solid white",
                  padding: "10px 24px",
                  width: "fit-content",
                }}
              >
                Підписатися!
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default Home;
