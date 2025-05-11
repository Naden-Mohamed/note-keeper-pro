const Note = require('../database/models/Note');
const NoteVersion = require('../database/models/NoteVersion');

class MongoNoteRepository {
  async search(query, tags = []) {
    try {
      const searchConditions = {};
      
      if (query) {
        searchConditions.$text = { $search: query };
      }
      
      if (tags.length > 0) {
        searchConditions.tags = { $all: tags };
      }

      return await Note.find(searchConditions)
        .populate('createdBy', 'username email')
        .sort({ updatedAt: -1 });
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async saveVersion(noteId, newContent, userId) {
    const session = await Note.startSession();
    session.startTransaction();

    try {
      // 1. Update the main note
      const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        { content: newContent, updatedAt: Date.now() },
        { new: true, session }
      );

      if (!updatedNote) {
        throw new Error('Note not found');
      }

      // 2. Get the next version number
      const lastVersion = await NoteVersion.findOne({ noteId })
        .sort({ versionNumber: -1 })
        .session(session);
      
      const nextVersion = lastVersion ? lastVersion.versionNumber + 1 : 1;

      // 3. Create the version record
      await NoteVersion.create([{
        noteId,
        content: newContent,
        versionNumber: nextVersion,
        createdBy: userId
      }], { session });

      await session.commitTransaction();
      return updatedNote;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Version save failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  async getVersions(noteId) {
    try {
      return await NoteVersion.find({ noteId })
        .populate('createdBy', 'username email')
        .sort({ versionNumber: -1 });
    } catch (error) {
      throw new Error(`Failed to get versions: ${error.message}`);
    }
  }

  async restoreVersion(noteId, versionId, userId) {
    const session = await Note.startSession();
    session.startTransaction();

    try {
      // 1. Get the version to restore
      const version = await NoteVersion.findOne({
        _id: versionId,
        noteId
      }).session(session);

      if (!version) {
        throw new Error('Version not found');
      }

      // 2. Update the main note with old content
      const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        { content: version.content, updatedAt: Date.now() },
        { new: true, session }
      );

      // 3. Create a new version entry for the restore action
      const lastVersion = await NoteVersion.findOne({ noteId })
        .sort({ versionNumber: -1 })
        .session(session);

      await NoteVersion.create([{
        noteId,
        content: version.content,
        versionNumber: lastVersion.versionNumber + 1,
        createdBy: userId,
        isRestore: true,
        restoredFrom: versionId
      }], { session });

      await session.commitTransaction();
      return updatedNote;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Restore failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  async create(note) {
    try {
      const newNote = await Note.create(note);
      // Create initial version
      await NoteVersion.create({
        noteId: newNote._id,
        content: newNote.content,
        versionNumber: 1,
        createdBy: newNote.createdBy
      });
      return newNote;
    } catch (error) {
      throw new Error(`Note creation failed: ${error.message}`);
    }
  }

  async update(note) {
    try {
      return await Note.findByIdAndUpdate(
        note._id,
        { $set: note },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Note update failed: ${error.message}`);
    }
  }
}

module.exports = MongoNoteRepository;