import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../services/api'; // Updated import path

const VersionHistory = ({ open, onClose, noteId }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVersions = async () => {
            if (!noteId) return;

            try {
                setLoading(true);
                const response = await api.get(`/notes/${noteId}/versions`);
                setVersions(response.data);
            } catch (err) {
                setError('Failed to fetch versions');
                console.error('Error fetching versions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVersions();
    }, [noteId]);

    const handleRestore = async (versionId) => {
        try {
            setLoading(true);
            await api.post(`/notes/${noteId}/restore`, { versionId });
            onClose(true);
        } catch (err) {
            setError('Failed to restore version');
            console.error('Error restoring version:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>Version History</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                {loading && <Typography>Loading...</Typography>}

                <List>
                    {versions.map((version, index) => (
                        <React.Fragment key={version._id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Version ${versions.length - index}`}
                                    secondary={format(new Date(version.createdAt), 'PPpp')}
                                />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        size="small"
                                        onClick={() => handleRestore(version._id)}
                                        disabled={loading}
                                    >
                                        Restore
                                    </Button>
                                </Box>
                            </ListItem>
                            {index < versions.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default VersionHistory;