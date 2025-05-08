class ManageNoteVersions {
  constructor(noteRepo) {
    this.noteRepo = noteRepo;
  }

  async save(noteId, content, userId) {
    return await this.noteRepo.saveVersion(noteId, content, userId);
  }

  async getAll(noteId) {
    return await this.noteRepo.getVersions(noteId);
  }

  async restore(noteId, versionId, userId) {
    return await this.noteRepo.restoreVersion(noteId, versionId, userId);
  }
}

module.exports = ManageNoteVersions;
// This class is responsible for managing note versions. It interacts with the NoteRepository to save, retrieve, and restore note versions. The methods are asynchronous to handle potential database operations. The constructor takes a NoteRepository instance as a parameter, allowing for dependency injection and easier testing.