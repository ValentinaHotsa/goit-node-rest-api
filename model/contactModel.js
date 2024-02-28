const { Schema, model } = require("mongoose");
const Joi = require("joi");
// const handleMongooseError = require("../helpers/handleMongooseError");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
// contactSchema.post("save", handleMongooseError);
const newContact = model("contact", contactSchema);

const createContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string(),
})
  .min(1)
  .message("Body must have at least one field");

const updateStatusSchema = Joi.object({
  favourite: Joi.boolean().required(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
  newContact,
};
