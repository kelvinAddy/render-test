const express = require("express");

const app = express();

app.use(express.static("dist"));

app.use(express.json());

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
];

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const resourceId = req.params.id;
  const note = notes.find((note) => note.id === resourceId);
  if (note) res.json(note);
  else res.status(400).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const newNote = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = [...notes, newNote];
  res.json(newNote);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
