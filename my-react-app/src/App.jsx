import CreateNote from "./CreateNote";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    //fetches data only on initial load
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/noteapi/allnotes"
      );
      setNoteList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  async function addNote(note) {
    await axios.post("http://localhost:3000/noteapi/createnote", note);
    fetchNotes(); // fetches data after a note is added, still fetches data if there's an error with adding the note
  }

  async function deleteNote(id) {
    try {
      await axios.delete(`http://localhost:3000/noteapi/deletenote/${id}`);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  }

  async function editNote(id, newTitle, newContent) {
    const updatedNotesList = noteList.map((prevNotes) =>
      prevNotes.id === id
        ? { ...prevNotes, title: newTitle, content: newContent }
        : prevNotes
    );
    setNoteList(updatedNotesList);
    const newNote = {
      title: newTitle,
      content: newContent,
    };
    await axios.patch(`http://localhost:3000/noteapi/editnote/${id}`, newNote);
  }

  return (
    <div className="wrapper">
      <Header />
      <CreateNote onAdd={addNote} />
      <div className="note-list">
        {noteList.map((noteItem, index) => (
          <Note
            key={index}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onEdit={editNote}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default App;
