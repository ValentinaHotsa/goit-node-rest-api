const { newContact } = require("../model/contactModel");
const {
  updateStatusSchema,
  createContactSchema,
  updateContactSchema,
} = require("../model/contactModel");

// ----ALL CONTACTS----//

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;

  try {
    const result = await newContact.find({ owner });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ----GET ONE CONTACT----//

const getOneContact = async (req, res) => {
  const { _id: owner } = req.user;
  try {
    const result = await newContact.findById(owner);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting contact by id:", error.message);
    res.status(404).json({ message: "Contact not found." });
  }
};

// ----CREATE CONTACT----//

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;

  try {
    await createContactSchema.validateAsync({ name, email, phone });
    const result = await newContact.create({ name, email, phone, owner });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating contact", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ----UPDATE CONTACT----//

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    if (!name && !email && !phone === undefined) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }
    await updateContactSchema.validateAsync({ name, email, phone });
    const result = await newContact.findByIdAndUpdated(
      { _id: id },
      { name, email, phone },
      {
        new: true,
      }
    );
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error updating contact", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ----DELETE CONTACT----//

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await newContact.findByIdAndDelete(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Contact not found" });
  }
};

// ----UPDATE STATUS CONTACT----//

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  try {
    const result = await newContact.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error updating status", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
