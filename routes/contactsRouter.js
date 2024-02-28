const express = require("express");

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../controllers/contactsControllers.js");
const { authenticate } = require("../middlewares/authenticate");

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, getOneContact);

contactsRouter.delete("/:id", authenticate, deleteContact);

contactsRouter.post("/", authenticate, createContact);

contactsRouter.put("/:id", authenticate, updateContact);

contactsRouter.patch("/:id/favorite", authenticate, updateStatusContact);

module.exports = contactsRouter;
