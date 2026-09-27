const User = require('../Models/user');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
  });
  res.json(users);
};

exports.postUser = async (req, res) => {
  if (!req.body?.username || !req.body?.password)
    return res.status(400).json({ error: 'Invalid data provided' });

  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    username,
    name,
    passwordHash,
  });
  res.status(201).json(newUser);
};
