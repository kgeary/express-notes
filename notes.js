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
  index() {
    this.data.forEach((el, index) => (el.id = index + 1));
  }

  /** Load the notes array from file
   * @param {boolean} indexData
   */
  load(indexData = false) {
    try {
      this.data = JSON.parse(fs.readFileSync(path_db, "utf8"));
      if (indexData) {
        this.index();
      }
    } catch (err) {
      this.data = [];
    }
    return this.data;
  }

  /**
   * Save the notes arrary to file
   */ 
  save() {
    fs.writeFileSync(path_db, JSON.stringify(this.data, null, 2));
  }

  /**
   * Add a Note to the array
   * @param {Object} bodyObject note containing 'title' and 'text' to add
   *
   * @returns {Object}
   * new Note object or null if unable to add note
   */
  add(bodyObject) {
    //this.load();

    if (bodyObject && bodyObject.title  && bodyObject.text)
    {
      const newId = this.data.length + 1;
      const parsedObject = {
        id: newId,
        title: bodyObject.title,
        text: bodyObject.text
      };
      this.data.push(parsedObject);
      this.save();
      return parsedObject; 
    } else {
      return null;
    }
  }

  /**
   * Delete a note from the array
   * @param {number} index to delete from the array
   * @returns {Object}
   * the deleted note or null on invalid index
   */
  remove(index) {
    //this.load();
    if (index >= 0 && index < this.data.length) {
      const deletedNote = this.data.splice(index, 1);
      this.index();
      this.save();
      return deletedNote;
    } else {
      return null;
    }
  }
}

module.exports = Notes;