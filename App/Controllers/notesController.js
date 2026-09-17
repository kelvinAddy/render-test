const Note = require('../Models/note');

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find({});
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

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const savedNote = await Note.create({
    content: body.content,
    important: body.important || false,
  });

  res.status(201).json(savedNote);
};
