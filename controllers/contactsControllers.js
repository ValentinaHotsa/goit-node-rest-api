const Contacts = require("../services/contactsServices");

const {
  createContactSchema,
  updateContactSchema,
} = require("../schemas/contactsSchemas");

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contacts.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contacts.getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error getting contact by id:", error.message);
    res.status(404).json({ message: "Contact not found." });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contacts.removeContact(id);
    if (deleteContact) {
      res.status(200).json(deleteContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Contact not found" });
  }
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    await createContactSchema.validateAsync({ name, email, phone });
    const result = await Contacts.addContact(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating contact", error.message);
    res.status(400).json({ message: error.message });
  }
};

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
    const result = await Contacts.updateContactById(id, name, email, phone);
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

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};
