import React, { useState} from 'react';
import { Box, Typography, Button } from '@mui/material';
import NoteList from '../components/notes/NoteList';
import NoteEditor from '../components/notes/NoteEditor';
import { useNotes } from '../context/NotesContext'; // Updated import path

const NotesPage = () => {
    const {currentNote, setCurrentNote } = useNotes(); // Using the context hook
    const [isEditing, setIsEditing] = useState(false);
    const [setIsCreating] = useState(false);

    const handleCreateNote = () => {
        setCurrentNote(null);
        setIsCreating(true);
        setIsEditing(true);
    };

    const handleEditNote = (note) => {
        setCurrentNote(note);
        setIsCreating(false);
        setIsEditing(true);
    };

    const handleSaveNote = async (noteData) => {
        // This would be handled in the NoteEditor component via API calls
        // and the context would be updated via the addNote/updateNoteInList methods
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setIsCreating(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">My Notes</Typography>
                <Button
                    variant="contained"
                    onClick={handleCreateNote}
                    disabled={isEditing}
                >
                    Create New Note
                </Button>
            </Box>

            {isEditing ? (
                <NoteEditor
                    note={currentNote}
                    onSave={handleSaveNote}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <NoteList
                    onEditNote={handleEditNote}
                />
            )}
        </Box>
    );
};

export default NotesPage;