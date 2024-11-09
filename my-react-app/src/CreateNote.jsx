import React, { useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateNote(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="create-note">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={note.title}
        />
        <textarea
          name="content"
          placeholder="Take a note..."
          onChange={handleChange}
          value={note.content}
          rows="3"
        />
        <button onClick={submitNote}>
          <AddBoxIcon style={{ verticalAlign: "middle" }} />
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
