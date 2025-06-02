import { Avatar, Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./style.css";

const CommentElement = ({
  user,
  date,
  text,
  onDelete,
  currentUserId,
  commentUserId,
}) => {
  const isOwnComment = currentUserId === commentUserId;

  return (
    <div className="commentContainer">
      <Avatar
        size={84}
        src={user?.profile_picture || "/img-pack/icons/user-blacktheme.png"}
      />
      <div className="commentContent">
        <div className="postUserContent">
          <div className="postUser">{user?.name || "unknown user"}</div>
          <div className="postUsername">@{user?.username}</div>
          {/* <div className="postDate">{date}</div> */}
        </div>
        <div className="commentText">{text}</div>
      </div>
      {isOwnComment && (
        <Button
          type="text"
          danger
          size="small"
          onClick={() => onDelete(text)}
          className="deleteCommentButton"
        >
          <CloseCircleOutlined style={{ fontSize: 30 }}/>
        </Button>
      )}
    </div>
  );
};

export default CommentElement;
