import { useEffect, useState } from 'react';
import Note from './components/Note';
import notesService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNotes, setNewNotes] = useState('');
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    notesService.getAllNotes().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();

    if (newNotes.trim() === '') {
      return;
    }

    const newNote = {
      content: newNotes,
      important: Math.random() < 0.5,
    };

    notesService.createNotes(newNote).then((returnedNote) => {
      setNotes([...notes, returnedNote]);
      setNewNotes('');
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .updateNotes(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        console.error('error:', error);
        alert(`the note ${note.content} was already deleted from server`);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input
          type='text'
          value={newNotes}
          onChange={(event) => setNewNotes(event.target.value)}
        />
        <button type='submit'>save</button>
      </form>

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
    </div>
  );
};

export default App;
