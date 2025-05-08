
function checkNotePermission(requiredPermission) {
    return async (req, res, next) => {
        const note = await Note.findById(req.params.id);

        // Owner has all permissions
        if (note.userId.toString() === req.user._id.toString()) return next();

        const collaboration = note.collaborators.find(
            c => c.user.toString() === req.user._id.toString()
        );

        if (!collaboration || !hasPermission(collaboration.permission, requiredPermission)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}
function checkEditPermission(noteRepository) {
    return async (req, res, next) => {
      const note = await noteRepository.findById(req.params.id);
      const userId = req.user.id; // Assuming auth middleware sets this
      const collaborator = note.collaborators.find(c => c.user.toString() === userId);
      if (!collaborator || !['edit', 'admin'].includes(collaborator.permission)) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      next();
    };
  }
  
// Permission hierarchy
function hasPermission(userPermission, requiredPermission) {
    const hierarchy = { view: 0, edit: 1, admin: 2 };
    return hierarchy[userPermission] >= hierarchy[requiredPermission];
}