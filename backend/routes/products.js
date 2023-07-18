const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.post(`/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    stock: req.body.stock,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((error) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
  console.log(product);
});

module.exports = router;
