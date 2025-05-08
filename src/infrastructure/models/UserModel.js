const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    sharedNotes: [{
      noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
      permission: String
    }]
  });