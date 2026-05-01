import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Note from '../components/note';
import '../styles/home.css';

function Home() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api.get('/api/notes/')
            .then((res) => setNotes(res.data))
            .catch((err) => console.error(err));
    };

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`)
            .then((res) => { if (res.status === 204) getNotes(); })
            .catch((err) => console.error(err));
    };

    const createNote = (e) => {
        e.preventDefault();
        api.post('/api/notes/', { title, content })
            .then((res) => {
                if (res.status === 201) {
                    setTitle('');
                    setContent('');
                    getNotes();
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="home-wrapper">
            <nav className="home-nav">
                <span className="home-nav-brand">Notes</span>
                <button className="btn-logout" onClick={() => navigate('/logout')}>
                    Log out
                </button>
            </nav>
            <div className="home-container">
                <section className="notes-section">
                    <div className="section-header">
                        <h2>My Notes</h2>
                        <span className="note-count">{notes.length}</span>
                    </div>
                    {notes.length === 0 ? (
                        <p className="notes-empty">No notes yet. Create your first one below.</p>
                    ) : (
                        <div className="notes-grid">
                            {notes.map((note) => (
                                <Note key={note.id} note={note} onDelete={deleteNote} />
                            ))}
                        </div>
                    )}
                </section>
                <section className="create-note-card">
                    <h2>New Note</h2>
                    <form onSubmit={createNote}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Note title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your note..."
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Create Note</button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Home;
