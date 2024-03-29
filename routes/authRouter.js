const express = require("express");
const {
  register,
  login,
  logOut,
  updateAvatar,
} = require("../controllers/userControllers");
const { authenticate } = require("../middlewares/authenticate");
const { upload } = require("../middlewares/upload");

const userRouter = express.Router();
const jsonParcer = express.json();

userRouter.post("/register", jsonParcer, register);
userRouter.post("/login", jsonParcer, login);
userRouter.get("/logout", authenticate, logOut);
userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

module.exports = userRouter;
