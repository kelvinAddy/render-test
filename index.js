require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const { Note } = require("./mongo.js");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

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

app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body;
  const id = req.params.id;
  Note.findById(id).then((note) => {
    if (!note) return res.status(404).json({ Error: "Note was not found on the server" });

    note.important = important;
    note.content = content;
    note
      .save()
      .then((updatedNote) => res.json(updatedNote))
      .catch(next);
  });
});

app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((person) => {
      res.status(204).end();
    })
    .catch(next);
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  });

  newNote
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch(next);
});

const unKnownEndpoint = (req, res) => {
  res.status(400).json({ error: "Unknown Endpoint" });
};

app.use(unKnownEndpoint);

const handleError = (err, req, res, next) => {
  if (err.name === "CastError") res.status(500).json({ error: "Malformatted id" });
  else if (err.name === "ValidationError") res.status(400).json({ error: err.message });
};

app.use(handleError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
