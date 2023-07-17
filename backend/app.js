const express = require("express");
const app = express();
require("dotenv/config"); //read env variables  from .env file

const api = process.env.API_URL;

//Middleware configuration
app.use(express.json())

// http://localhost:3000/api/v1/

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

app.listen(4000, () => {
  console.log(`Hello API Test is working from .env file + ${api}`);
  console.log("listening on port http://localhost:3000");
});
