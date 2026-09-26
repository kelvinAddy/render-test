const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (doc, resObj) => {
    resObj.id = resObj._id.toString();
    delete resObj.__v;
    delete resObj._id;
    delete resObj.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
