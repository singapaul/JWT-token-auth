require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const { reset } = require("nodemon");
const app = express();
app.use(express.json());

const ranNum = Math.floor(Math.random() * 10);
console.log("Hi Paul ", ranNum);

const posts = [
  { username: "Paul", age: 26, hobby: "baseball" },
  { username: "Shannon", age: 23, hobby: "running" },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.username));
});

// creating a middleware

function authenticateToken(req, res, next) {
  // Get token, veryify user, return user. This token comes from the header
  const authheader = req.headers["authorization"];
  //   The && just checks that an authorization header is present
  const token = authheader && authheader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
