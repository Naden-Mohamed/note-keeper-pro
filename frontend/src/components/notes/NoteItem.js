import React, { useState, useContext } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Chip
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Share as ShareIcon,
    Delete as DeleteIcon,
    Archive as ArchiveIcon,
    Unarchive as UnarchiveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../context/NotesContext';
import VersionHistory from './VersionHistory';
import NoteShareModal from './NoteShareModal';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { formatDate } from '../../utils/helpers';
import HistoryIcon from '@mui/icons-material/History'; // If using MUI
import { truncateText, extractPlainText } from '../../utils/textUtils';

const NoteItem = ({ note }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [versionModalOpen, setVersionModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
    const { deleteNote, updateNoteInList } = useContext(useNotes);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        await deleteNote(note._id);
        setDeleteDialogOpen(false);
    };

    const handleArchive = async () => {
        await updateNoteInList({
            ...note,
            isArchived: !note.isArchived
        });
        setArchiveDialogOpen(false);
    };

    return (
        <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        onClick={() => navigate(`/notes/${note._id}`)}
                        sx={{ cursor: 'pointer' }}
                    >
                        {note.title}
                    </Typography>
                    <IconButton onClick={handleMenuOpen}>
                        <MoreIcon />
                    </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {formatDate(note.updatedAt)}
                </Typography>

                {note.tags?.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                        {note.tags.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                            />
                        ))}
                    </Box>
                )}

                <Typography variant="body1" paragraph>
                    {truncateText(extractPlainText(note.content), 150)}
                </Typography>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => {
                        navigate(`/notes/${note._id}`);
                        handleMenuClose();
                    }}>
                        <EditIcon sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setShareModalOpen(true);
                        handleMenuClose();
                    }}>
                        <ShareIcon sx={{ mr: 1 }} /> Share
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setVersionModalOpen(true);
                        handleMenuClose();
                    }}>
                        <HistoryIcon sx={{ mr: 1 }} /> Version History
                    </MenuItem>
                    <MenuItem onClick={() => {
                        note.isArchived ? setArchiveDialogOpen(true) : handleArchive();
                        handleMenuClose();
                    }}>
                        {note.isArchived ? (
                            <>
                                <UnarchiveIcon sx={{ mr: 1 }} /> Unarchive
                            </>
                        ) : (
                            <>
                                <ArchiveIcon sx={{ mr: 1 }} /> Archive
                            </>
                        )}
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setDeleteDialogOpen(true);
                        handleMenuClose();
                    }}>
                        <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
                    </MenuItem>
                </Menu>

                <NoteShareModal
                    open={shareModalOpen}
                    onClose={() => setShareModalOpen(false)}
                    noteId={note._id}
                    currentShares={note.sharedWith || []}
                />

                <VersionHistory
                    open={versionModalOpen}
                    onClose={() => setVersionModalOpen(false)}
                    noteId={note._id}
                />

                <ConfirmationDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title="Delete Note"
                    message="Are you sure you want to delete this note? This action cannot be undone."
                />

                {archiveDialogOpen && (
                    <ConfirmationDialog
                        open={archiveDialogOpen}
                        onClose={() => setArchiveDialogOpen(false)}
                        onConfirm={handleArchive}
                        title={note.isArchived ? "Unarchive Note" : "Archive Note"}
                        message={`Are you sure you want to ${note.isArchived ? "unarchive" : "archive"} this note?`}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default NoteItem;