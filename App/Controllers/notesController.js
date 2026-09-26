const Note = require('../Models/note');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  res.json(notes);
};

exports.getNoteById = async (req, res, next) => {
  const fetchedNote = await Note.findById(req.params.id);
  if (fetchedNote) res.json(fetchedNote);
  else res.status(404).end();
};

exports.putNoteById = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Data is invalid' });
  }

  if (!req.body.content) {
    return res.status(400).json({ error: 'Content is missing' });
  }

  const fetchedNote = await Note.findById(req.params.id);
  if (!fetchedNote) {
    return res.status(404).end();
  }
  fetchedNote.important = req.body.important;
  fetchedNote.content = req.body.content;
  const savedNote = await fetchedNote.save();
  res.json(savedNote);
};

exports.deleteNoteById = async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

exports.postNote = async (req, res, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Token is invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid' });
  }

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const savedNote = await Note.create({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  user.notes = [...user.notes, savedNote._id];
  await user.save();

  res.status(201).json(savedNote);
};
