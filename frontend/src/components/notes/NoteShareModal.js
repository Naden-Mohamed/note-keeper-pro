import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Chip,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import api from '../../services/api'; // Updated import path

const NoteShareModal = ({ open, onClose, noteId, currentShares = [] }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [permission, setPermission] = useState('view');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleShare = async () => {
        if (!selectedUser) {
            setError('Please select a user');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await api.post(`/notes/${noteId}/share`, {
                userId: selectedUser._id,
                permission
            });
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to share note');
            console.error('Error sharing note:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Share Note</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}

                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1">Current shares:</Typography>
                    {currentShares.length === 0 ? (
                        <Typography>No shares yet</Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                            {currentShares.map(share => (
                                <Chip
                                    key={share.user._id}
                                    label={`${share.user.name} (${share.permission})`}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                <Autocomplete
                    options={users}
                    getOptionLabel={(user) => user.name}
                    value={selectedUser}
                    onChange={(e, newValue) => setSelectedUser(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select user" fullWidth />
                    )}
                    sx={{ my: 2 }}
                />

                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>Permission</InputLabel>
                    <Select
                        value={permission}
                        label="Permission"
                        onChange={(e) => setPermission(e.target.value)}
                    >
                        <MenuItem value="view">View only</MenuItem>
                        <MenuItem value="edit">Can edit</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button
                    onClick={handleShare}
                    disabled={!selectedUser || loading}
                    variant="contained"
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoteShareModal;