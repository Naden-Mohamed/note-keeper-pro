import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchNotes, fetchNoteById } from '../services/api';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getNotes = async (params = {}) => {
        try {
            setLoading(true);
            const response = await fetchNotes(params);
            setNotes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const getNoteById = async (id) => {
        try {
            setLoading(true);
            const response = await fetchNoteById(id);
            setCurrentNote(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch note');
        } finally {
            setLoading(false);
        }
    };

    const addNote = (note) => {
        setNotes([note, ...notes]);
    };

    const updateNoteInList = (updatedNote) => {
        setNotes(notes.map(note =>
            note._id === updatedNote._id ? updatedNote : note
        ));
    };

    const removeNote = (id) => {
        setNotes(notes.filter(note => note._id !== id));
    };

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <NotesContext.Provider
            value={{
                notes,
                currentNote,
                loading,
                error,
                getNotes,
                getNoteById,
                addNote,
                updateNoteInList,
                removeNote,
                setCurrentNote
            }}
        >
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => useContext(NotesContext);