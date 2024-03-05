const { User } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

// REGISTRATION NEW USER //

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user !== null) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    }
    // const newUser = new User({ name, email });
    // newUser.setPassword(password);
    // await newUser.save();
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    await User.create({
      name,
      email: normalizedEmail,
      password: passwordHash,
      avatarURL,
    });
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN USER //

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user === null) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    res.json({
      token,
      code: 200,
      message: "Login successful.",
    });
  } catch (error) {
    next(error);
  }
};

// LOG OUT //

const logOut = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status.end();
  } catch (error) {
    next(error);
  }
};

// UPDATE AVATAR //

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalName } = req.file;
  const resultUpload = path.join(avatarsDir, originalName);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", originalName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

// EXPORTS //
module.exports = { register, login, logOut, updateAvatar };
