import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
    return (
        <TextField
            placeholder="Search notes..."
            variant="outlined"
            size="small"
            fullWidth
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            sx={{ maxWidth: 400 }}
        />
    );
};

export default SearchBar;