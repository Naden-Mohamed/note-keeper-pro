import React, { useContext } from 'react';
import { Box, Typography, List, Paper, CircularProgress } from '@mui/material';
import NoteItem from './NoteItem';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import { useNotes } from '../../context/NotesContext';

const NoteList = ({ showArchived = false }) => {
    const { notes, loading, error } = useContext(useNotes);
    const [searchTerm, setSearchTerm] = SearchBar('');
    const [selectedTags, setSelectedTags] = TagFilter([]);

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => note.tags.includes(tag));
        const matchesArchiveStatus = showArchived ? note.isArchived : !note.isArchived;

        return matchesSearch && matchesTags && matchesArchiveStatus;
    });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <SearchBar onSearch={setSearchTerm} />
                <TagFilter
                    selectedTags={selectedTags}
                    onTagSelect={setSelectedTags}
                />
            </Box>

            {filteredNotes.length === 0 ? (
                <Typography>No notes found</Typography>
            ) : (
                <List>
                    {filteredNotes.map(note => (
                        <NoteItem key={note._id} note={note} />
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default NoteList;