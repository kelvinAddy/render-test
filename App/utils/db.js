const mongoose = require('mongoose');
const config = require('./config');

const connectToDb = async () => {
  mongoose.connect(config.MONGODB_URI, { family: 4 });
};

module.exports = connectToDb;
