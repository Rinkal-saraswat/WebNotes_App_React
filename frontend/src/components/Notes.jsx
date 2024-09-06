import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteInput((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateNote = async () => {
    if (editId === null) {
      // Add Note
      try {
        await axios.post('http://localhost:5000/api/notes', noteInput);
        setNoteInput({ title: '', content: '' });
        fetchNotes();
      } catch (error) {
        console.error('Error adding note:', error);
      }
    } else {
      // Update Note
      try {
        await axios.put(`http://localhost:5000/api/notes/${editId}`, noteInput);
        setNoteInput({ title: '', content: '' });
        setEditId(null);
        fetchNotes();
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEdit = (note) => {
    setNoteInput({ title: note.title, content: note.content });
    setEditId(note.id);
  };

  return (
    <div className="App">
      <h1>Notes App</h1>

      <div className="txt">
        <input
          type="text"
          name="title"
          placeholder="Take a note..."
          value={noteInput.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={noteInput.content}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={addOrUpdateNote}>
          {editId === null ? 'Add Note' : 'Update Note'}
        </button>
      </div>

      <div className="all-note">
        {notes.map((note) => (
          <div key={note.id} className="note">
            <div>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <p>{note.created_at}</p>
              <div className="action">
                <CiEdit onClick={() => handleEdit(note)} />
                <FaTrash onClick={() => deleteNote(note.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
