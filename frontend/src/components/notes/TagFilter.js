import React, { useState, useEffect, useContext } from 'react';
import { Autocomplete, TextField, Chip} from '@mui/material';
import { useNotes } from '../../context/NotesContext';

const TagFilter = ({ selectedTags, onTagSelect }) => {
    const { notes } = useContext(useNotes);
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const tags = new Set();
        notes.forEach(note => {
            note.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
    }, [notes]);

    return (
        <Autocomplete
            multiple
            options={allTags}
            value={selectedTags}
            onChange={(event, newValue) => {
                onTagSelect(newValue);
            }}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Filter by tags"
                    placeholder="Select tags"
                />
            )}
            sx={{ minWidth: 250 }}
        />
    );
};

export default TagFilter;