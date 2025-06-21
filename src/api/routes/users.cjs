const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.get("/allusers", async (req, res) => {
  // Take all items from member Collection
  try {
    const items = await User.find();
    res.json(items);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
router.patch("/usersetpersonaltrainer", async (req, res) => {
  const { userId, trainerId, action } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId is requiared!" });
  }
  if (!trainerId) {
    return res.status(400).json({ message: "TrainerId is requiared!" });
  }

  try {
    const user = await User.findById(userId);
    const trainer = await User.findById(trainerId);

    if (action == "accept") {
      user.personalTrainerId = trainerId;

      trainer.clientId = userId;
      // } else {
      //   return res
      //     .status(400)
      //     .json({ message: "You already have an personal trainer!" });
      // }
    } else user.personalTrainerId = "rejected";

    await user.save();
    await trainer.save();

    res.json({ message: "Trainer changes is equipped!" });
  } catch (err) {
    res.status(500).send(`Server error ${err}`);
  }
});
router.get("/userbyid/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format!" });
  }
  try {
    const userbyid = await User.findOne({ _id: id }).select("-password");
    if (!userbyid) {
      return res
        .status(400)
        .json({ message: "There are no account with such id!" });
    }
    res.json(userbyid);
  } catch (error) {
    res.status(500).send(`Server error ${error}`);
  }
});
router.get("/currentuserdata", async (req, res) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === undefined || token === "null") {
    return res.status(500).json({ message: "Ur not logined yet" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Такої пошти немає, спочатку зареєструйтеся!" });
    }

    res.json({ message: "Access given", user });
  } catch (error) {
    return res.status(401).json({ message: "Token error" });
  }
});
router.put("/user/:id/password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong old password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/updateuser", async (req, res) => {
  try {
    const {
      id,
      username,
      name,
      lastname,
      email,
      role,
      phone,
      profileDescription,
      picture,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingUser = await User.findById(id).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const [checkUsername, checkEmail, checkPhone] = await Promise.all([
      //Check user's data if it's repeats or not
      User.findOne({ username }).select("-password"),
      User.findOne({ email }).select("-password"),
      User.findOne({ phone }).select("-password"),
    ]);

    if (checkUsername && checkUsername.id !== id) {
      //check username
      return res.status(400).json({ message: "Username already exists" });
    }
    if (checkEmail && checkEmail.id !== id) {
      //check email
      return res.status(400).json({ message: "Email already exists" });
    }
    if (checkPhone && checkPhone.id !== id) {
      // check email
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      // find user by his id and update data to new that was inputed
      id,
      {
        username,
        name,
        last_name: lastname,
        email,
        role,
        phone,
        profile_picture: picture,
        profileDescription,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/changerole/:userId", async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!userId || !role) {
    res.status(400).send(`Server error ${error}`);
  }

  try {
    const user = await User.findById(userId);

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "Role successfully changed!" });
  } catch (err) {
    res.status(500).send(`Server error ${err}`);
  }
});

router.get("/api/email", async (req, res) => {
  // Take all emails from member Collection
  try {
    const email = await User.find();
    res.json(email);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;