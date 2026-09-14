const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 5,
      required: true,
    },
    important: Boolean,
  },
  {
    toJSON: {
      transform: (doc, resObj) => {
        resObj.id = resObj._id.toString();
        delete resObj.__v;
        delete resObj._id;
      },
    },
  },
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
