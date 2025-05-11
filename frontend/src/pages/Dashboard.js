import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import NoteList from '../components/notes/NoteList';

const Dashboard = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <NoteList />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;