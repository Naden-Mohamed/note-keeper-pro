class NoteRepository {
  async search(query, tags) {
    throw new Error('Not implemented');
  }

  async saveVersion(noteId, newContent, userId) {
    throw new Error('Not implemented');
  }

  async getVersions(noteId) {
    throw new Error('Not implemented');
  }

  async restoreVersion(noteId, versionId, userId) {
    throw new Error('Not implemented');
  }

  // Optional: Add create and update methods to support new notes
  async create(note) {
    throw new Error('Not implemented');
  }

  async update(note) {
    throw new Error('Not implemented');
  }
}

module.exports = NoteRepository;
