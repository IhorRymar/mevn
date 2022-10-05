const Joi = require('joi');
const path = require('path');
const fs = require('fs/promises');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const contactsPath = path.join(__dirname, './contacts.json');

async function getAll() {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
}

async function create(name, email, phone) {
  const contacts = await getAll();
  const result = Joi.validate(name, email, phone, schema);
  if (result.error === null) {
    const newId = parseInt(contacts[contacts.length - 1].id) + 1;
    const newContact = {
      id: `${newId}`,
      name,
      email,
      phone,
    };
    const newContactsList = JSON.stringify([...contacts, newContact]);
    await fs.writeFile(contactsPath, newContactsList);
    return newContact;
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  create,
  getAll,
};
