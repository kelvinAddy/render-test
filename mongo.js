const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit;
}

const password = process.argv[2];

const url = `mongodb://keladdy2131_db_user:${password}@ac-xk7f7mp-shard-00-00.ks4ou4x.mongodb.net:27017,ac-xk7f7mp-shard-00-01.ks4ou4x.mongodb.net:27017,ac-xk7f7mp-shard-00-02.ks4ou4x.mongodb.net:27017/noteApp?ssl=true&replicaSet=atlas-ergdbv-shard-0&authSource=admin&appName=Cluster00`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const examSchema = new mongoose.Schema({
  name: String,
  difficulty: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const Exam = mongoose.model("Exam", examSchema);

// const exam = new Exam({
//   name: "Basic Mechanics",
//   difficulty: true,
// });

// exam.save().then((res) => {
//   console.log("Exam data was saved");
//   mongoose.connection.close();
// });

// const note = new Note({});

Note.find({ important: true }).then((res) => {
  res.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// note.save().then((res) => {
//   console.log("note is save");
//   console.log(res);
//   mongoose.connection.close();
// });
