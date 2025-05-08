class SearchNotes {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(query, tags) {
    return await this.noteRepository.search(query, tags);
  }
}

module.exports = SearchNotes;
// This class is responsible for searching notes based on a query and optional tags. It interacts with the NoteRepository to perform the search operation. The constructor takes a NoteRepository instance as a parameter, allowing for dependency injection and easier testing.
// The execute method is asynchronous to handle potential database operations.