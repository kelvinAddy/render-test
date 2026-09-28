const Note = require('../Models/note');

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  res.json(notes);
};

exports.getNoteById = async (req, res) => {
  const fetchedNote = await Note.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  if (fetchedNote) res.json(fetchedNote);
  else res.status(404).end();
};

exports.putNoteById = async (req, res) => {
  if (!req?.body?.content?.trim()) {
    return res.status(400).json({ error: 'Data is invalid' });
  }

  const user = req.user;
  const fetchedNote = await Note.findById(req.params.id);

  if (user?._id.toString() === fetchedNote?.user?.toString()) {
    fetchedNote.important = req.body.important;
    fetchedNote.content = req.body.content;
    await fetchedNote.save();
    res.json(fetchedNote);
  } else res.status(401).json({ error: 'Unable to perform the request' });
};

exports.deleteNoteById = async (req, res) => {
  const noteToDelete = await Note.findById(req?.params?.id);
  const user = req.user;

  if (user?._id?.toString() === noteToDelete?.user?.toString()) {
    await noteToDelete.deleteOne();
    res.status(204).end();
  } else res.status(401).json({ error: 'Unable to perform the request' });
};

exports.postNote = async (req, res) => {
  if (!req.body?.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const user = req.user;

  const savedNote = await Note.create({
    content: req.body.content,
    important: req.body?.important || false,
    user: user._id,
  });

  user.notes = [...user.notes, savedNote._id];
  await user.save();

  res.status(201).json(savedNote);
};
