// import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";


function Home() {
  const [items, setItems] = useState([]);
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);


  useEffect(() => {
    axios.get("/api/items")
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  const scrollTo = (ref) => {
    if (ref.current) {
      const offset = -80; // Настройка смещения
      const targetPosition =
        ref.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };
  
  return (
    <div>
      <div className="sectionNav">
        {/* <button onClick={scrollToTop}>1</button> */}
        <button onClick={() => scrollTo(section1)}>1</button>
        <button onClick={() => scrollTo(section2)}>2</button>
        <button onClick={() => scrollTo(section3)}>3</button>
      </div>
      
      <div ref={section1} className="section">blockadqwqwdiqwdioqwdjioqwdjioqwdojiqwdoijdqwijodqwoijqwdioiqwdoijqwd</div>
      <div ref={section2} className="section"><h1>Items</h1>
        <ul>
          {items.map(item => (
            <li key={item._id}>
              <h3>Name: {item.name} Age: {item.age}</h3>
            </li>
          ))}
        </ul></div>
      <div ref={section3} className="section">
        <div className="wrapper">
          <div className="gallery">
            <div className="card">1</div>
            <div className="card">2</div>
            <div className="card">3</div>
            <div className="card">4</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
