import React from "react";
import "../styles/note.css";

export default function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleString("en-US");
    return (
        <div className="note-card">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            <div className="note-footer">
                <span className="note-date">{formattedDate}</span>
                <button className="note-delete-btn" onClick={() => onDelete(note.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}
