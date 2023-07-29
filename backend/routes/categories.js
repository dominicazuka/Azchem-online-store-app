const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// All Categories
router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});


// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(404).send('Invalid Category ID')
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      res
        .status(500)
        .json({ message: "The category with the given id is not available" });
    }
    res.status(200).send(category);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
    });
    category = await category.save();
    if (!category)
      return res.status(404).send("The category cannot be created");
    res.send(category);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(404).send('Invalid Category ID')
    }
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    },
    {new: true}
    );
    if (!category)
      return res.status(404).send("The category cannot be created");
    res.send(category);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
}); 


// Delete category
router.delete("/:id", async (req, res) => {
  try {
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.status(404).send('Invalid Category ID')
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

module.exports = router;
