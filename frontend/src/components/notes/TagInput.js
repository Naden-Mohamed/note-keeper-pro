import React, { useState } from 'react';
import { TextField } from '@mui/material';

const TagInput = ({ onAddTag }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onAddTag(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <TextField
            size="small"
            placeholder="Add tag..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ width: 120 }}
        />
    );
};

export default TagInput;