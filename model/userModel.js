// const bCrypt = require("bcryptjs");
const { Schema, model } = require("mongoose");
// const handleMongooseError = require("../helpers/handleMongooseError");
const Joi = require("joi");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],

      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);
// userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const User = model("user", userSchema);

module.exports = { registerSchema, loginSchema, User };
