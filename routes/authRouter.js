const express = require("express");
const { register, login } = require("../controllers/userControllers");
const { authenticate } = require("../middlewares/authenticate");

const userRouter = express.Router();
const jsonParcer = express.json();

userRouter.post("/register", jsonParcer, register);
userRouter.post("/login", jsonParcer, login);

module.exports = userRouter;
