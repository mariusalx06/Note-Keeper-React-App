import express from "express";
import pg from "pg";
import bodyParser from "body-parser"; // for Postman
import cors from "cors";
import env from "dotenv";

env.config();
const db = new pg.Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

const app = express();
const port = 3000;
db.connect();
app.use(express.json()); //for React Forms
// app.use(bodyParser.urlencoded({extended: true})); // for Postman

app.use(cors());

app.get("/noteapi/allnotes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.json(`${error}`);
  }
});

app.get("/noteapi/note/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const result = await db.query("SELECT * from notes where id=$1", [id]);
  if (result.rows[0] != null) {
    res.json(result.rows[0]);
  } else {
    res.json("Note doesn't exist! The id is invalid.");
  }
});

app.post("/noteapi/createnote", async (req, res) => {
  const { title, content } = req.body;

  try {
    await db.query("INSERT INTO notes(title,content) VALUES($1,$2)", [
      title,
      content,
    ]);

    const result = await db.query(
      "SELECT * FROM notes WHERE id=(SELECT MAX(id) FROM notes)"
    );

    res.json({
      message: "Note add succesfully!",
      addedNote: result.rows[0],
    });
  } catch (error) {
    res.json(`${error}`);
  }
});

app.put("/noteapi/replacenote/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const result = await db.query("SELECT * FROM notes WHERE id=$1", [id]);

  if (result.rows[0] != null) {
    try {
      if (!title) {
        res.json("Title is missing");
      } else if (!content) {
        res.json("Content is missing");
      } else {
        await db.query("UPDATE notes SET title=$1, content=$2 WHERE id=$3", [
          title,
          content,
          id,
        ]);
        const updatedResult = await db.query(
          "SELECT * FROM notes WHERE id=$1",
          [id]
        );
        res.json({
          message: "Note updated succesfully",
          updatedNote: updatedResult.rows[0],
        });
      }
    } catch (error) {
      res.json(`${error}`);
    }
  } else {
    res.json("The id is invalid.");
  }
});

app.patch("/noteapi/editnote/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const result = await db.query("SELECT * FROM notes WHERE id=$1", [id]);
  if (result.rows[0] != null) {
    try {
      if (title && content) {
        await db.query("UPDATE notes SET title=$1, content=$2 WHERE id=$3", [
          title,
          content,
          id,
        ]);
        const updatedNote = await db.query("SELECT from notes where id=$1", [
          id,
        ]);
        res.json(updatedNote.rows[0]);
      } else if (content) {
        await db.query("UPDATE notes SET content=$1 WHERE id=$2", [
          content,
          id,
        ]);
        const updatedNote = await db.query("SELECT from notes where id=$1", [
          id,
        ]);
        res.json(updatedNote.rows[0]);
      } else if (title) {
        await db.query("UPDATE notes SET title=$1 WHERE id=$2", [title, id]);
        const updatedNote = await db.query("SELECT from notes where id=$1", [
          id,
        ]);
        res.json(updatedNote.rows[0]);
      } else {
        res.json({
          message: "Note hasn't changed, no data to modify",
          note: result.rows[0],
        });
      }
    } catch (error) {
      res.json(`${error}`);
    }
  } else {
    res.json("The id is invalid.");
  }
});

app.delete("/noteapi/deletenote/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.query("SELECT from notes where id=$1", [id]);
  if (result.rows[0] != null) {
    try {
      await db.query("DELETE FROM notes WHERE id=$1", [id]);
      res.json("Note deleted succesfully");
    } catch (error) {
      res.json(`${error}`);
    }
  } else {
    res.json("The id is invalid.");
  }
});

app.delete("/noteapi/deleteall", async (req, res) => {
  try {
    await db.query("DELETE FROM notes");
    res.json("All notes deleted sucessfully");
  } catch (error) {
    res.json(`${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
