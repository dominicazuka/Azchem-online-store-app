const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config"); //read env variables  from .env file

//Middleware configuration
app.use(express.json());
app.use(morgan("tiny"));

// http://localhost:3000/api/v1/
const api = process.env.API_URL;

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  stock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

app.post(`${api}/products`, (req, res) => {
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
      res.status(500).json({ message: error.message });
    });
  console.log(product);
});

app.get(`${api}/products`, async (req, res) => {
  const allProducts = await Product.find();

  if (!allProducts) {
    res.status(500).json({ success: false });
  }
  res.send(allProducts);
});

app.get(`${api}/users`, (req, res) => {
  const user = {
    id: 1,
    name: "John",
    image: "test.jpg",
  };

  res.send(user);
});

app.post(`${api}/users`, (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  res.send(newUser);
});

//Connect the database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error" + error);
  });

//Start the server
app.listen(3000, () => {
  console.log(`Hello API Test is working from .env file + ${api}`);
  console.log("listening on port http://localhost:3000");
});
