class MongoNoteRepository {
  constructor(NoteModel) {
    this.Note = NoteModel;
  }

  // CRUD Operations
  async create(noteData) {
    const note = new this.Note(noteData);
    return await note.save();
  }

  async findById(id) {
    return await this.Note.findById(id);
  }
  async findAll() {
    return this.Note.find({}).populate('owner', 'email name');

  }
  async update(id, updateData) {
    return this.Note.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  }

  async delete(id) {
    return await this.Note.findByIdAndDelete(id);
  }

  // Search and Version Management (existing)
  async search(query, tags) {
    const filters = [];

    if (query) {
      filters.push({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'content.text': { $regex: query, $options: 'i' } }
        ]
      });
    }

    if (tags && tags.length > 0) {
      filters.push({ tags: { $in: tags } });
    }

    const finalQuery = filters.length > 0 ? { $and: filters } : {};
    return await this.Note.find(finalQuery);
  }

  async saveVersion(noteId, newContent, userId) {
    const note = await this.Note.findById(noteId);
    if (!note) throw new Error('Note not found');

    note.history.push({
      content: note.content,
      title: note.title,
      editedBy: userId,
      timestamp: new Date()
    });

    note.content = newContent;
    return await note.save();
  }

  async getVersions(noteId) {
    const note = await this.Note.findById(noteId);
    if (!note) throw new Error('Note not found');

    return note.history;
  }

  async restoreVersion(noteId, versionId, userId) {
    const note = await this.Note.findById(noteId);
    if (!note) throw new Error('Note not found');

    const version = note.history.id(versionId);
    if (!version) throw new Error('Version not found');

    note.history.push({
      content: note.content,
      title: note.title,
      editedBy: userId,
      timestamp: new Date()
    });

    note.content = version.content;
    note.title = version.title;

    return await note.save();
  }

  // Additional useful methods
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await this.Note.find().skip(skip).limit(limit);
  }

  async findByUser(userId) {
    return await this.Note.find({ userId });
  }
  async addCollaborator(noteId, userId, permission) {
    return this.Note.findByIdAndUpdate(
      noteId,
      { $addToSet: { collaborators: { user: userId, permission } } },
      { new: true }
    );
  }

  async createShareLink(noteId, token, permission, expiresInHours) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    return this.Note.findByIdAndUpdate(
      noteId,
      { shareLink: { token, expiresAt, permission } },
      { new: true }
    );
  }
  async validateShareToken(token) {
    const note = await this.Note.findOne({ "shareLink.token": token });
    if (!note || note.shareLink.expiresAt < new Date()) throw new Error("Invalid or expired share link");
    return note;
  }
  async logActivity(noteId, userId, action, metadata = {}) {
    return this.Note.findByIdAndUpdate(noteId, {
      $push: {
        activityLog: {
          user: userId,
          action,
          metadata,
          timestamp: new Date()
        }
      }
    });
  }

}

module.exports = MongoNoteRepository;