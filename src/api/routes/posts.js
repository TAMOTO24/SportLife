const express = require("express");
const router = express.Router();
const Post = require("../../models/post");
const User = require("../../models/user");

router.post("/createpagepost", async (req, res) => {
  const { filePaths, description, userId } = req.body; //Take data post img paths and description

  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", ""); //Verify user JWT token

  if (!token || token === undefined || token === "null") {
    return res.status(500).json({ message: "Ur not logined yet" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Decode tokin to get user id from it

    const answerUser = await User.findOne({ _id: userId }); //Find user by id

    const newPost = new Post({
      userId: userId,
      text: description,
      user: answerUser.name || "",
      username: answerUser.username,
      gallery: filePaths || [],
      userIcon: answerUser.icon || "",
      created_by: userId,
    });
    await newPost.save();
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/api/getposts", async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "User Id is required!" });
  }

  try {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(200).json({ message: "There are no posts" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).send(`Server error: ${err}`);
  }
});

router.delete("/deletecomment/:postId/:comment", async (req, res) => {
  const { postId, comment } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    post.comment = post.comment.filter((c) => c.text.toString() !== comment);
    await post.save();

    res.json({ message: "Коментар видалено", updatedPost: post });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.patch("/createcomment/:postId", async (req, res) => {
  const { postId } = req.params;
  const { text, userId } = req.body;

  if (!postId || !userId || !text) {
    return res.status(500).json({ message: "all data is required!" });
  }
  try {
    const post = await Post.findById(postId);
    let comment = {
      id: userId,
      text,
    };

    post.comment.push(comment);
    await post.save();
    res.json({ post, comment });
  } catch (error) {
    res.status(500).json({ message: `Server error ${error}` });
  }
});

router.get("/postbyid/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User Id is required!" });
  }

  try {
    const post = await Post.find({ created_by: userId });
    if (!post) {
      return res.status(200).json({ message: "There are no posts" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).send("Server error", err);
  }
});

router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "User Id is required!" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(200).json({ message: "There are no posts" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).send(`Server error: ${err}`);
  }
});
router.put("/api/like", async (req, res) => {
  const { userid, id } = req.body;

  if (!userid || !id) {
    return res
      .status(400)
      .json({ message: "User ID and Post ID are required" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = post.like || [];

    if (post.like.includes(userid)) {
      post.like = likes.filter((uid) => uid !== userid);
    } else {
      post.like.push(userid);
    }

    await post.save();
    res.json({
      message: "Post liked/unliked successfully",
      likeCount: post.like.length,
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.put("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(404).json({ message: "Id is important" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post didn't exist anymore or something went wrong!",
      });
    }
    post.text = req.body.text || post.text;
    post.date = req.body.date || post.date;
    post.gallery = req.body.gallery || post.gallery;
    post.like = req.body.like || post.like;
    post.created_by = req.body.created_by || post.created_by;

    await post.save();
    res.status(200).json({ message: "Post updated successfully!", post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error changing post" });
  }
});

module.exports = router;