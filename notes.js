const fs = require("fs");

const path_db = "./db/db.json";

/**
 * @class A persistent notes class that allows retrieving, adding, and deleting
 */
class Notes {
  constructor() {
    this.data = [];
  }

  /**
   * Index the id's of all notes to make sure they are unique
   */
  indexNotes() {
    this.data.forEach((el, index) => (el.id = index + 1));
  }

  /** Load the notes array from file
   * @param {boolean} indexData
   */
  loadNotes(indexData = false) {
    try {
      this.data = JSON.parse(fs.readFileSync(path_db, "utf8"));
      if (indexData) {
        this.indexNotes();
      }
    } catch (err) {
      this.data = [];
    }
    return this.data;
  }

  /**
   * Save the notes arrary to file
   */ 
  saveNotes() {
    fs.writeFileSync(path_db, JSON.stringify(this.data, null, 2));
  }

  /**
   * Add a Note to the array
   * @param {Object} bodyObject note containing 'title' and 'text' to add
   */
  addNote(bodyObject) {
    //this.loadNotes();
    const newId = this.data.length + 1;
    const parsedObject = {
      id: newId,
      title: bodyObject.title,
      text: bodyObject.text
    };
    this.data.push(parsedObject);
    this.saveNotes();
    return parsedObject;
  }

  /**
   * Delete a note from the array
   * @param {number} index to delete from the array
   * @returns {Object}
   * the deleted note or null on invalid index
   */
  deleteNote(index) {
    //this.loadNotes();
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
