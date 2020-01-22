const fs = require("fs");

const path_db = "./db/db.json";

class Notes {
  constructor() {
    this.data = [];
    this.loadNotes();
    this.indexNotes();
  }

  // Index the id's of all notes to make sure they are unique
  indexNotes() {
    this.data.forEach((el, index) => (el.id = index + 1));
  }

  // Load the notes array from file
  loadNotes() {
    try {
      this.data = JSON.parse(fs.readFileSync(path_db, "utf8"));
    } catch (err) {
      this.data = [];
    }
    return this.data;
  }

  // Save the notes arrary to file
  saveNotes() {
    fs.writeFileSync(path_db, JSON.stringify(this.data, null, 2));
  }

  // Add a Note to the array
  addNote(obj) {
    this.loadNotes();
    const newId = this.data.length + 1;
    const parsedObject = { 
      id: newId, 
      title: obj.title, 
      text: obj.text, 
    };
    this.data.push(parsedObject);
    this.saveNotes();
    return obj;
  }

  // Delete a note from the array
  deleteNote(index) {
    this.loadNotes();
    if (index >= 0 && index < this.data.length) {
      const deletedNote = this.data.splice(index, 1);
      this.indexNotes();
      this.saveNotes();
      return deletedNote;
    } else {
      return null;
    }
  }
}


module.exports = Notes;