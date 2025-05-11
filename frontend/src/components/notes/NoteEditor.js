import React, { useState, useRef } from 'react';  // Added useState and useRef imports
import { Editor } from '@tinymce/tinymce-react';
import { Box, TextField, Button, Chip, Stack, Typography } from '@mui/material';
import RichTextToolbar from '../ui/RichTextToolbar';
import TagInput from './TagInput';

const NoteEditor = ({ note, onSave, onCancel }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content] = useState(note?.content || '');
    const [tags, setTags] = useState(note?.tags || []);
    const editorRef = useRef(null);

    const handleSave = () => {
        const content = editorRef.current.getContent();
        onSave({
            title,
            content,
            richContent: content,
            tags
        });
    };

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <Box sx={{ p: 3 }}>
            <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Tags:</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                {tags.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                    />
                ))}
                <TagInput onAddTag={handleAddTag} />
            </Stack>

            <RichTextToolbar />
            <Editor
                apiKey="your-tinymce-api-key"
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={content}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount checklist'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help | table | checklist',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </Box>
        </Box>
    );
};

export default NoteEditor;