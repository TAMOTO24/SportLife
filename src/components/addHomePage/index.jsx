// import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";

function Home() {
  const [items, setItems] = useState([]);
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const backgrounds = [
    "url(./img-pack/page1.jpg)",
    "url(./img-pack/page2.jpg)",
    "url(./img-pack/page3.jpg)",
    "url(./img-pack/page4.png)",
  ];

  useEffect(() => {
    axios
      .get("/api/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));

    // const interval = setInterval(() => {
    //   setActiveIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    // }, 3000);

    // return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => { // Change the background image on clicked current dot
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
    <div>
      <div className="sectionNav">
        <button onClick={() => scrollTo(section1)}>1</button>
        <button onClick={() => scrollTo(section2)}>2</button>
        <button onClick={() => scrollTo(section3)}>3</button>
      </div>

      <div
        ref={section1}
        className="section"
        id="FPage"
        style={{ backgroundImage: backgrounds[activeIndex] }}
      >{/*Background home swiper*/}
        <div className="page-content">
          <h1>Home</h1>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, cum quam, voluptate commodi error pariatur inventore sunt repellendus provident laborum doloribus, exercitationem tempora dolorum vitae magni quasi. Ullam, error? Laborum.</div>
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
      <div ref={section2} className="section">
        <h1>Items</h1>
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <h3>
                Name: {item.name} Age: {item.age}
              </h3>
            </li>
          ))}
        </ul>
      </div>
      {/* <div ref={section3} className="section">
        <div className="wrapper">
          <div className="gallery">
            <div className="card">1</div>
            <div className="card">2</div>
            <div className="card">3</div>
            <div className="card">4</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
