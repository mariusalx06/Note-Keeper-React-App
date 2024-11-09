import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";

function Note(props) {
  const [editMode, setEditMode] = useState(false);
  const [newNote, setNewNote] = useState({
    title: props.title,
    content: props.content,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNewNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function handleEdit(event) {
    setEditMode(!editMode);
    event.preventDefault();
  }

  function handleSave(event) {
    props.onEdit(props.id, newNote.title, newNote.content);
    setEditMode(false);
    event.preventDefault();
  }

  function handleClick(event) {
    editMode && setEditMode(false);
    props.onDelete(props.id);
    event.preventDefault();
  }

  function handleCancelEdit(event) {
    setEditMode(false);
    setNewNote({
      title: props.title,
      content: props.content,
    });
    event.preventDefault();
  }

  useEffect(() => {
    setNewNote({
      title: props.title,
      content: props.content,
    });
  }, [props.title, props.content]);

  return (
    <div className="note">
      {editMode ? (
        <div>
          <input
            name="title"
            onChange={handleChange} // Update title
            placeholder="Edit Title"
            style={{ width: "100%", marginBottom: "10px" }}
            value={newNote.title}
          />
          <textarea
            name="content"
            onChange={handleChange} // Update content
            placeholder="Edit Content"
            rows="4"
            style={{ width: "100%", marginBottom: "10px" }}
            value={newNote.content}
          />
          <button onClick={handleSave} className="saveButton">
            <SaveIcon style={{ verticalAlign: "middle" }} />
          </button>
          <button>
            <ClearIcon
              onClick={handleCancelEdit}
              style={{
                verticalAlign: "middle",
                color: "#D50000",
                fontSize: "1.9rem",
              }}
            />
          </button>
          <button className="rightbutton" onClick={handleClick}>
            <DeleteIcon style={{ verticalAlign: "middle", color: "#D50000" }} />
          </button>
        </div>
      ) : (
        <div>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <button className="rightbutton" onClick={handleClick}>
            <DeleteIcon style={{ verticalAlign: "middle", color: "#D50000" }} />
          </button>

          <button className="leftbutton" onClick={handleEdit}>
            <EditIcon style={{ verticalAlign: "middle", color: "#FF9800" }} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Note;
