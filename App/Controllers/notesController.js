const Note = require('../Models/note');

exports.displayAllNotes = (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
};

exports.displayNoteById = (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) res.json(note);
      else res.status(404).end();
    })
    .catch(next);
};

exports.editNoteById = (req, res, next) => {
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
exports.deleteNoteById = (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};

exports.addNote = (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  });

  newNote
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch(next);
};
