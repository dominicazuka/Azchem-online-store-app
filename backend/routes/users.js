const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const eventManager = require("../event");

// Get all users
router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid User ID");
    }
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      res
        .status(500)
        .json({ message: "The user with the given id is not available" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Create a new user
router.post("/register", async (req, res) => {
  try {
    const findUsers = await User.find({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (findUsers.length > 0) {
      return res.status(409).json({message:`A user with that credentials (Phone No. or Email) already exist!`});
    }
    // console.log("body", req.body);
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    eventManager.emit("new_user", {
      ...user._doc,
      password: req.body.password,
    });
    user = await user.save();
    if (!user) return res.status(404).send("The user cannot be created");
    res.send(user);
  } catch (error) {
    console.log("users Route Error:",  error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Log User Into the system
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.JWT_SECRET_KEY;
    if (!user) {
      return res.status(404).json({ message: "Wrong Credentials" });
    }
    const passwordCheck = bcrypt.compareSync(
      req.body.password,
      user.passwordHash
    );
    if (!passwordCheck) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }
    if (user && passwordCheck) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
          name: user.name,
          email: user.email,
          phone: user.phone,
          street: user.street,
          apartment: user.apartment,
          zip: user.zip,
          city: user.city,
          country: user.country,
        },
        secret,
        { expiresIn: "1d" }
      );
      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("Wrong Credentials");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Return user count for statistics
router.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.count();
    if (!userCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      userCount: userCount,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid User ID");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

module.exports = router;
