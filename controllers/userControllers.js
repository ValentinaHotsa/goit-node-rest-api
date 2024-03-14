const { User } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers/sendEmail");

const { SECRET_KEY, BASE_URL } = process.env;
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
    const verificationCode = nanoid();

    await User.create({
      name,
      email: normalizedEmail,
      password: passwordHash,
      avatarURL,
      verificationCode,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href ="${BASE_URL}/api/auth/verify/${verificationCode}"> Click verify email </a>`,
    };

    await sendEmail(verifyEmail);

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

// VERIFICATION EMAIL //

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    return res.status(401).send({ message: "Email not found." });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.json({ message: "Email verify successful." });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // throw
    return res.status(401).send({ message: "Email not found." });
  }
  if (user.verify) {
    return res
      .status(400)
      .send({ message: "Verification has already been passed" });
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `a target="_blank" href ="${BASE_URL}/api/auth/verify/${user.verificationCode}" Click verify email </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      message: "Registration successful",
    },
  });
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
    if (!user.verify) {
      throw res.status(401).send({ message: "Email is not verified" });
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
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const img = await Jimp.read(tempUpload);
  img.resize(250, 250).write(tempUpload);
  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    console.log(error);
  }

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

// EXPORTS //
module.exports = {
  register,
  login,
  logOut,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
