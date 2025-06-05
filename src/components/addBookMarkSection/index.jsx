import React from "react";
import "./style.css";
import PostElement from "../addPostElement";
import dayjs from "dayjs";

const BookmarkList = ({ bookmarks }) => {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="bookmark-empty">
        <h2>Наразі у вас немає збережених елементів 📭</h2>
        <p>Збережіть пости або тренування, щоб побачити їх тут.</p>
      </div>
    );
  }

  return (
    <div className="bookmark-container">
      <h1 className="bookmark-title">
        <b>Мої збереження</b>
      </h1>

      <div className="bookmark-list">
        {bookmarks.map((item) => {
          if (item.type === "post") {
            return (
              <div key={item._id} className="bookmark-item post">
                <PostElement item={item} hoverable={true} theme={true} />
              </div>
            );
          }

          if (item.type === "workout") {
            return (
              <div key={item._id} className="bookmark-item workout">
                <div className="workout-img">
                  <img
                    src={item.img?.[0] || "/placeholder.jpg"}
                    alt={item.title}
                  />
                </div>
                <div className="bookmark-item-content">
                  <h2 className="workout-title">{item.title}</h2>
                  <p className="workout-description">{item.description}</p>
                  <p className="workout-trainer">
                    👤 <strong>Тренер:</strong> {item.trainer}
                  </p>
                  <p className="workout-date">
                    Створено {dayjs(item.date).format("DD.MM")} год{" "}
                    {dayjs(item.date).format("HH:mm")}
                  </p>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default BookmarkList;
