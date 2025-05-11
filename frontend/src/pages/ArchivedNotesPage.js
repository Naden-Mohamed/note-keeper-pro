import React from 'react';
import { Box, Typography } from '@mui/material';
import NoteList from '../components/notes/NoteList';

const ArchivedNotesPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Archived Notes
            </Typography>
            <NoteList showArchived />
        </Box>
    );
};

export default ArchivedNotesPage;