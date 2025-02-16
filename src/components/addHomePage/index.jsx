// import { Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import axios from "axios";


function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("/api/items")
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);
  
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <h3>Name: {item.name} Age: {item.age}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
