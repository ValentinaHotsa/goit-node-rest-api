const express = require("express");
const { register, login, logOut } = require("../controllers/userControllers");
const { authenticate } = require("../middlewares/authenticate");

const userRouter = express.Router();
const jsonParcer = express.json();

userRouter.post("/register", jsonParcer, register);
userRouter.post("/login", jsonParcer, login);
userRouter.get("/logout", authenticate, logOut);

module.exports = userRouter;
