const Notes = require('../Notes');
const fs = require('fs');

jest.mock('fs');

describe("Notes Class Tests", function() {
  it("should load the results from a file", function() {
    const testArray = [
      { title: "Title1", text: "Text1" },
      { title: "Title2", text: "Text2" },
      { title: "Title3", text: "Text3" },
      { title: "Title4", text: "Text4" },
      { title: "Title5", text: "Text5" },
    ];
    
    // Mock fs functions
    fs.writeFileSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(testArray));

    let notes = new Notes(); // Create an empty array of notes
    notes.loadNotes();
    notes.indexNotes();
    expect(notes.data.length).toEqual(5);
  });

  it("should have a size of 2 after adding 2 notes", function() {
    let notes = new Notes([]); // Create an empty array of notes
    notes.addNote({ title: "Title1", text: "Text1" });
    notes.addNote({ title: "Title2", text: "Text2" });
    expect(notes.data.length).toEqual(2);
  });

  it("should have indexed notes", function() {
    let notes = new Notes([]); // Create an empty array of notes
    notes.addNote({ title: "Title1", text: "Text1" });
    notes.addNote({ title: "Title2", text: "Text2" });
    notes.addNote({ title: "Title3", text: "Text3" });
    expect(notes.data[0].id).toEqual(1);
    expect(notes.data[0].title).toEqual("Title1");
    expect(notes.data[0].text).toEqual("Text1");
    expect(notes.data[1].id).toEqual(2);
    expect(notes.data[2].id).toEqual(3);
  });

  it("should have indexed notes after deletion", function() {
    let notes = new Notes([]); // Create an empty array of notes
    notes.addNote({ title: "Title1", text: "Text1" });
    notes.addNote({ title: "Title2", text: "Text2" });
    notes.addNote({ title: "Title3", text: "Text3" });
    notes.deleteNote(2);
    expect(notes.data[0].id).toEqual(1);
    expect(notes.data[1].id).toEqual(2);
  });
});
