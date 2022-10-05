const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const contacts = require('./db/contacts');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.get('/contacts', (req, res) => {
  contacts.getAll().then((contacts) => {
    res.json(contacts);
  });
});

app.post('/contacts', (req, res) => {
  console.log(req.body);
  contacts
    .create(req.body)
    .then((contact) => {
      res.json(contact);
    })
    .catch((error) => {
      res.status(500);
      res.json(error);
    });
});

const port = process.env.PORT || 2222;
app.listen(port, () => {
  console.log(`Welcome on port ${port}...`);
});
