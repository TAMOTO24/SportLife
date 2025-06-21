const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Post = require("../../models/post");
const Workouts = require("../../models/workouts");

router.get("/allbookmarks/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(404).json({ message: "Id is important" });
  }

  try {
    const user = await User.findById(userId);

    if (!user || !Array.isArray(user.bookmarks)) {
      return res.status(404).json({ message: "User or bookmarks not found" });
    }

    const bookmarkIds = user.bookmarks.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const posts = await Post.find({ _id: { $in: bookmarkIds } });
    const workouts = await Workouts.find({ _id: { $in: bookmarkIds } });

    const postBookmarks = posts.map((post) => ({
      ...post.toObject(),
      type: "post",
    }));

    const workoutBookmarks = workouts.map((workout) => ({
      ...workout.toObject(),
      type: "workout",
    }));

    const allBookmarks = [...postBookmarks, ...workoutBookmarks];

    const sortedBookmarks = user.bookmarks.map((id) =>
      allBookmarks.find((item) => item._id.toString() === id.toString())
    );

    res.json({ success: true, bookmarks: sortedBookmarks });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error retriving bookmarks" });
  }
});

router.put("/bookmark/:userId", async (req, res) => {
  const { userId } = req.params;
  const { bookmarkId } = req.body;

  if (!bookmarkId) {
    return res.status(400).json({ message: "BookMarkId is requiered!" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Users id is requiered!" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!Array.isArray(user.bookmarks)) {
      user.bookmarks = [];
    }

    if (user.bookmarks.includes(bookmarkId)) {
      const index = user?.bookmarks?.indexOf(bookmarkId);

      if (index > -1) {
        user.bookmarks.splice(index, 1);
      }
    } else {
      user?.bookmarks.push(bookmarkId);
    }

    await user.save();

    res.json({
      success: true,
      mark_status: user?.bookmarks.includes(bookmarkId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error bookmark" });
  }
});

module.exports = router;