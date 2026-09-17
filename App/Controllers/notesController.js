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

exports.putNoteById = (req, res, next) => {
  const { content, important } = req.body;
  Note.findById(req.params.id).then((note) => {
    if (!note) {
      return res.status(404).end();
    }
    note.important = important;
    note.content = content;
    note
      .save()
      .then((updatedNote) => res.json(updatedNote))
      .catch(next);
  });
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
