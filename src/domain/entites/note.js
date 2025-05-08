class Note {
  constructor({ id, title, content, tags = [], collaborators = [], history = [] }) {
    this.id = id;
    this.title = title;
    this.content = content; // an array of structured blocks
    this.tags = tags;
    this.collaborators = collaborators; // { userId, permission: 'view' | 'edit' }
    this.history = history; // previous versions of this note
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  updateContent(newContent) {
    // Save current content to history before updating
    this.history.push({
      timestamp: new Date(),
      content: this.content,
      title: this.title,
    });

    this.content = newContent;
  }

  restoreVersion(versionIndex) {
    const version = this.history[versionIndex];
    if (version) {
      this.content = version.content;
      this.title = version.title;
    } else {
      throw new Error("Invalid version index");
    }
  }

  addCollaborator(userId, permission = 'view') {
    const exists = this.collaborators.find(c => c.userId === userId);
    if (!exists) {
      this.collaborators.push({ userId, permission });
    }
  }

  updateCollaboratorPermission(userId, newPermission) {
    const collaborator = this.collaborators.find(c => c.userId === userId);
    if (collaborator) {
      collaborator.permission = newPermission;
    }
  }

  canUserEdit(userId) {
    const collab = this.collaborators.find(c => c.userId === userId);
    return collab?.permission === 'edit';
  }

  canUserView(userId) {
    const collab = this.collaborators.find(c => c.userId === userId);
    return !!collab;
  }
}

module.exports = Note;
