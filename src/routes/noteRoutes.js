const express = require('express');
const router = express.Router();

const NoteModel = require('../infrastructure/models/NoteModel');
const MongoNoteRepository = require('../infrastructure/db/MongoNoteRepository');

// Initialize your repository
const noteRepository = new MongoNoteRepository(NoteModel);

// Call the controller factory function with the repository
const noteController = require('../interfaces/controllers/NoteController')(noteRepository);
console.log('Note Controller:', noteController);

router.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

// Basic test route
router.get('/notes', noteController.getAllNotes);

router.get('/search', noteController.search);
// CRUD Routes
router.post('/', noteController.createNote);
router.get('/:id', noteController.getNote);
router.put('/:id', noteController.updateNote); // Make sure this exists in your controller
router.delete('/:id', noteController.deleteNote);

// Versioning Routes

router.post('/:id/version', noteController.saveVersion);
router.get('/:id/versions', noteController.getVersions);
router.post('/:id/restore', noteController.restoreVersion);

module.exports = router;