const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); //read env variables  from .env file
const cors = require("cors"); 
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options('*', cors()) //would later modify to a specific api domain

//Middleware configuration
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler)

//Route configuration'
const categoriesRoute = require('./routes/categories')
const productsRoute = require('./routes/products')
const usersRoute = require('./routes/users')
const ordersRoute = require('./routes/orders');

// http://localhost:3000/api/v1/
const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/products`, productsRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/orders`, ordersRoute);

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