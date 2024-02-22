const Joi = require("joi");

const createContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .regex(/^(\+\d{2})?(\d{10}|\d{3}-\d{3}-\d{2}-\d{2})$/)
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().regex(/^(\+\d{2})?(\d{10}|\d{3}-\d{3}-\d{2}-\d{2})$/),
})
  .min(1)
  .message("Body must have at least one field");

const updateStatusSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().regex(/^(\+\d{2})?(\d{10}|\d{3}-\d{3}-\d{2}-\d{2})$/),
  favourite: Joi.boolean(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
};
