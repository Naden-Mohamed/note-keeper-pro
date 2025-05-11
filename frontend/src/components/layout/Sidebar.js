import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
    Home as HomeIcon,
    Note as NoteIcon,
    People as SharedIcon,
    Archive as ArchiveIcon
} from '@mui/icons-material';

const Sidebar = ({ open, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
        { text: 'My Notes', icon: <NoteIcon />, path: '/notes' },
        { text: 'Shared Notes', icon: <SharedIcon />, path: '/shared' },
        { text: 'Archived', icon: <ArchiveIcon />, path: '/archived' }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' }
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;