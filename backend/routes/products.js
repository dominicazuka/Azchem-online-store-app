const { Category } = require("../models/category");
const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

//extension of images for upload
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//Image Upload on storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(" ").join("-"); //random naming of the file
    const extension = FILE_TYPE_MAP[file.mimetype]; //EXTENSION ASSIGNMENT
    const newFileName = fileName.replace(/\.(jpeg|jpg|png)$/, ""); //remove the extra mime type
    cb(null, `${newFileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// Get all Products
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter).populate("category"); //filter using queries like: Product.find().select, Product.find().select('name'), Product.find().select('name image -_id')
    if (!productList) {
      res.status(500).json({ success: false });
    }
    res.send(productList);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid Product ID");
    }
    const product = await Product.findById(req.params.id).populate("category"); //.populate searches using reference to other model in the db by provided ID
    if (!product) {
      res.status(500).json({ success: false });
    }
    res.send(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Create a new product
router.post("/", uploadOptions.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    console.log("category found", category);
    if (!category) return res.status(404).send("Invalid Category");
    const file = req.file;
    if (!file) return res.status(404).send("No image found in the request");
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    let product = await Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      size: req.body.size,
      rating: req.body.rating,
      color: req.body.color,
      isFeatured: req.body.isFeatured,
      numReviews: req.body.numReviews,
    });
    product = await product.save();
    if (!product) return res.status(500).send("The product cannot be created");
    console.log("Product Created >>> ", product);
    res.send(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Update product
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid Product ID");
    }
    const category = await Category.findById(req.body.category);
    console.log("category found", category);
    if (!category) return res.status(404).send("Invalid Category");

    const _product = await Product.findById(req.params.id);
    if (!_product) return res.status(400).send("Invalid Product!");

    const file = req.file;
    let imagePath;
    if (file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    } else {
      imagePath = _product.image;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        size: req.body.size,
        rating: req.body.rating,
        color: req.body.color,
        isFeatured: req.body.isFeatured,
        numReviews: req.body.numReviews,
      },
      { new: true }
    );
    if (!product) return res.status(404).send("The category cannot be updated");
    res.send(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("Invalid Product ID");
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Return product count for statistics
router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.count();
    if (!productCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      productCount: productCount,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// Return featured product
router.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      +count
    ); // "+" prefix converts string to number
    if (!featuredProducts) {
      res.status(500).json({ success: false });
    }
    res.send({
      featuredProducts: featuredProducts,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
  }
});

// multiple images upload
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Invalid Product ID");
      }
      const files = req.files;
      console.log("files", files);
      let imagesPath = [];
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

      if (files) {
        files.map((file) => {
          imagesPath.push(`${basePath}${file.filename}`);
          console.log("images path", imagesPath)
        });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagesPath,
        },
        { new: true }
      );
      if (!product) return res.status(500).send("Product cannot be updated!");
      res.send(product);
    } catch (error) {
      console.log(error);
    res
      .status(500)
      .json({ message: "Sorry an error occurred, please try again." });
    }
  }
);

module.exports = router;
