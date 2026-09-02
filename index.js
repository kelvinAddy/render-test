require("dotenv").config();

const express = require("express");

const { Note } = require("./mongo.js");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  const resourceId = req.params.id;
  Note.findById(resourceId)
    .then((note) => {
      if (note) res.json(note);
      else res.status(404).end();
    })
    .catch(next);
});

app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((person) => {
      res.status(204).end();
    })
    .catch(next);
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  });

  newNote.save().then((savedNote) => res.json(savedNote));
});

const unKnownEndpoint = (req, res) => {
  res.status(400).json({ error: "Unknown Endpoint" });
};

app.use(unKnownEndpoint);

const PORT = process.env.PORT;

const handleError = (err, req, res, next) => {
  if (err.name === "CastError") res.status(500).json({ error: "Malformatted id" });
};

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
