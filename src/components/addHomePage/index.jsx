// import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Form, Spin } from "antd";
import PostElement from "../addPostElement";
import TrainerCardElement from "../addTrainerCardElement";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

function Home() {
  const [items, setItems] = useState([]);
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
  useEffect(() => {
    axios
      .get("/api/getposts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get("/api/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    // Change the background image on clicked current dot
    setActiveIndex(index);
  };

  const scrollTo = (ref) => {
    if (ref.current) {
      const offset = -80; // Offset from the top of the page
      const targetPosition =
        ref.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ backgroundColor: "#111111" }}>
        <div className="sectionNav">
          <button onClick={() => scrollTo(section1)}>1</button>
          <button onClick={() => scrollTo(section2)}>2</button>
          <button onClick={() => scrollTo(section3)}>3</button>
          <button onClick={() => scrollTo(section3)}>4</button>
        </div>

        <div
          ref={section1}
          className="section"
          id="FPage"
          style={{ backgroundImage: backgrounds[activeIndex], height: "90vh" }}
        >
          {/*Background home swiper*/}
          <div className="page-content">
            <h1>Home</h1>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, cum quam, voluptate commodi error pariatur inventore
              sunt repellendus provident laborum doloribus, exercitationem
              tempora dolorum vitae magni quasi. Ullam, error? Laborum.
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
        <div class="section" ref={section2}>
          <div
            class="background"
            style={{
              backgroundImage:
                "url(/img-pack/trainers/strong-man-pulling-rope_23-2147671924.jpg)",
            }}
          />
          <div class="blog-section-block">
            <p className="blog-title">out blog</p>
            <p className="blog-subtitle">Look for the news & posts</p>
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
              <div className="blog-title">Our Team</div>
              <div className="blog-subtitle">
                Choose to train with experts you want
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
              View all of our experts
            </Button>
          </div>
          <TrainerCardElement />
        </div>
        <div ref={section4} className="section" style={{ height: "50vh" }}>
          <div
            class="background"
            style={{
              backgroundImage:
                "url(/img-pack/trainers/woman-helping-man-gym.jpg)",
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
              sigh your email to get news right into ur mailbox
            </p>
            <p style={{ fontSize: "5rem" }} id="titleItem">
              Get it an all the action
            </p>
            <Form
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Form.Item>
                <Input
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    padding: "20px",
                    minWidth: "600px",
                  }}
                />
              </Form.Item>
              <Button
                block
                ghost
                htmlType="submit"
                style={{
                  color: "white",
                  borderColor: "white",
                  padding: "2%",
                  maxWidth: "200px",
                }}
                variant="outlined"
              >
                Get Started
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default Home;
