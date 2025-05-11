import React from 'react';
import { Box, Typography } from '@mui/material';
import NoteList from '../components/notes/NoteList';

const SharedNotesPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Shared With Me
            </Typography>
            <NoteList sharedOnly />
        </Box>
    );
};

export default SharedNotesPage;