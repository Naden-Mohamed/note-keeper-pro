const SearchNotes = require('../../domain/usecases/SearchNotes');
const ManageNoteVersions = require('../../domain/usecases/ManageNoteVersions');
const note = require('../../infrastructure/models/NoteModel');

module.exports = (noteRepository) => {
  const searchNotes = new SearchNotes(noteRepository);
  const versionManager = new ManageNoteVersions(noteRepository);
  const crypto = require('crypto');

  return {

    async createNote(req, res) {
      try {
        // Use userId from request body instead of req.user
        const noteData = {
          title: req.body.title,
          content: req.body.content,
          userId: req.body.userId, // Match schema field name
          activityLog: [{
            user: req.body.userId, // Use from request body
            action: 'created',
            timestamp: new Date()
          }]
        };

        const note = await noteRepository.create(noteData);
        res.status(201).json(note);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async getNote(req, res) {
      try {
        const note = await noteRepository.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    // Add this to your controller methods
    async getAllNotes(req, res) {
      try {
        const notes = await noteRepository.findAll();
        res.json(notes); // Return actual data
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async updateNote(req, res) {
      try {
        const updateData = {
          ...req.body,
          $push: {
            activityLog: {
              // Use userId from params/body instead of req.user
              user: req.body.userId || req.params.userId,
              action: 'updated',
              timestamp: new Date()
            }
          }
        };

        const updatedNote = await noteRepository.update(req.params.id, updateData);
        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
        res.json(updatedNote);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    async deleteNote(req, res) { // ADD THIS METHOD
      try {
        const deletedNote = await noteRepository.delete(req.params.id);
        if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
        res.sendStatus(204);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    // Share note with specific user
    async shareNote(req, res) {
      try {
        const { noteId, userId, permission } = req.body;
        const updateData = {
          $addToSet: { collaborators: { user: userId, permission } },
          $push: {
            activityLog: {
              user: req.user._id,
              action: 'shared',
              metadata: { permission, userId },
              timestamp: new Date()
            }
          }
        };
        const updatedNote = await noteRepository.update(noteId, updateData);
        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
        res.json(updatedNote);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    // Generate shareable link
    async generateShareLink(req, res) {
      try {
        const { noteId, permission, expiresInHours } = req.body;
        const token = crypto.randomBytes(20).toString('hex');

        await noteRepository.createShareLink(
          noteId,
          token,
          permission,
          expiresInHours
        );

        res.json({ link: `${process.env.BASE_URL}/notes/join?token=${token}` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    async accessViaShareToken(req, res) {
      try {
        const { token } = req.params;
        const note = await noteRepository.validateShareToken(token);
        res.json(note);
      } catch (err) {
        res.status(403).json({ error: err.message });
      }
      if (!note || !note.shareLink || note.shareLink.expiresAt < Date.now()) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

    },
    // For checklist operations
    async updateChecklist(req, res) {
      try {
        const { noteId } = req.params;
        const { action, itemId, text, checked } = req.body;

        let update;
        switch (action) {
          case 'add':
            update = { $push: { 'content.checklist': { item: text, checked: false } } };
            break;
          case 'toggle':
            update = { $set: { 'content.checklist.$[elem].checked': checked } };
            break;
          case 'edit':
            update = { $set: { 'content.checklist.$[elem].text': text } };
            break;
          case 'delete':
            update = { $pull: { 'content.checklist': { _id: itemId } } };
            break;

          // ... other actions
        }

        const note = await Note.findByIdAndUpdate(
          noteId,
          update,
          { new: true, arrayFilters: [{ 'elem._id': itemId }] }
        );

        res.json(note);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    async search(req, res) {
      try {
        const query = req.query.query || '';
        const tags = req.query.tags ? req.query.tags.split(',') : [];
        const results = await searchNotes.execute(query, tags);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async saveVersion(req, res) {
      try {
        const { content, userId } = req.body;
        if (!content || !userId) {
          return res.status(400).json({ error: 'Missing content or userId' });
        }
        await versionManager.save(req.params.id, content, userId);
        res.sendStatus(200);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      note.activityLog.push({
        user: req.user._id,
        action: 'shared',
        metadata: { permission, userId }
      });
      await note.save();

    },

    async getVersions(req, res) {
      try {
        const versions = await versionManager.getAll(req.params.id);
        res.json(versions);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async restoreVersion(req, res) {
      try {
        const { versionId, userId } = req.body;
        if (!versionId || !userId) {
          return res.status(400).json({ error: 'Missing versionId or userId' });
        }
        await versionManager.restore(req.params.id, versionId, userId);
        res.sendStatus(200);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
