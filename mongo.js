require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url, { family: 4 })
  .then((res) => console.log("Connected to the Database"))
  .catch((err) => console.log(`Error connecting to the database: ${err.message}`));

const noteSchema = new mongoose.Schema(
  {
    content: String,
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

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
