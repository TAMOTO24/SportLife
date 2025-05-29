import React from "react";
import "./style.css";
import PostElement from "../addPostElement";

const BookmarkList = ({ bookmarks }) => {
  return (
    <>
      <h1>
        <b>Мої збереження</b>
      </h1>
      <div className="bookmark-list">
        {bookmarks.map((item) => {
          if (item.type === "post") {
            return <PostElement item={item} hoverable={true} theme={true} />;
          }

          if (item.type === "workout") {
            return (
              <div key={item._id} className="bookmark-item workout">
                <div>
                  <img src={item.img[0]} width="100%" />
                </div>
                <div className="bookmark-item-content">
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                  <p>
                    <strong>Trainer:</strong> {item.trainer}
                  </p>
                  {/* <p>
                  <strong>Type:</strong>{" "}
                  {Array.isArray(item.type)
                    ? item.type.join(", ")
                    : String(item.type)}
                </p> */}
                  <p style={{ color: "gray" }}>
                    {new Date(item.data).toLocaleDateString()}
                  </p>
                  {/* <div>
                  <strong>Machines:</strong> {item.exercise_machines.join(", ")}
                </div> */}
                  {/* <div>
                  <strong>Body activity:</strong>
                  <ul>
                    {item.body_activity.map((muscle, idx) => (
                      <li key={idx}>
                        {muscle.name} — A: {muscle.A}
                      </li>
                    ))}
                  </ul>
                </div> */}
                </div>
              </div>
            );
          }

          return null; // fallback на випадок невідомого типу
        })}
      </div>
    </>
  );
};

export default BookmarkList;
