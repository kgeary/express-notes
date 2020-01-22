// modules
const express = require('express')
const path = require('path')
const fs = require('fs')

// globals
const _debug = process.argv[2] === "debug";
const app = express();
const port = process.env.PORT || 80;
const path_public = path.join(__dirname, 'public'); // Need an absolute path

function debug(...str) {
  if (_debug) {
    console.log(...str);
  }
}

/** 
  * Load notes from db file into array
  * 
  * @returns {array}
  * The notes object array
  */
let firstTimeLoad = true;
function loadNotes() {
  let notes;
  try {
    debug("Loading...");
    const data = fs.readFileSync('./db/db.json', 'utf8');
    notes = JSON.parse(data);
    if (firstTimeLoad) {
      firstTimeLoad = false;
      indexNotes(notes);
    }
    debug("NOTES", notes);
  } catch (err) {
    // If no initial database found start with an empty list
    notes = [];
  }
  return notes;
}

/** 
  * Save Notes Array to file
  * 
  * @param {array} notes The notes object array
  */
function saveNotes(notes) {
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
}


/** 
  * Update the index of each note in the array so each has a unique id
  * 
  * @param {array} notes The notes object array
  */
function indexNotes(notes) {
  notes.forEach((el, index) => el.id = index + 1);
}

/**
 * Initialize the Webserver and Notes array then run the Webserver 
 */
function init() {
  // Load the notes from the database

  // Serve static files from public directory
  app.use(express.static('public'));

  // Need these in order to handle API requests 
  //(extended needs to be set to something or you get a warning).
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/notes', (req, res) => {
    // Return the notes html page
    res.sendFile('notes.html', { root: path_public });
  });

  // Route [get, post] /api/notes
  app.route('/api/notes')
    .get((req, res) => {
      // Request to get all notes, returns notes array
      debug("GET NOTES");
      res.send(loadNotes());
    })

    .post((req, res) => {
      // Request to add new note
      debug("POST NOTE BODY", req.body);
      // Make sure the body and title and text fields exist
      if (req.body && req.body.title && req.body.text) {
        // Add a new id field to the note object
        // Push the note to the notes array
        // Save the notes array to file
        // Send the response (new note object)
        let notes = loadNotes()
        req.body.id = notes.length + 1;
        notes.push(req.body);
        saveNotes(notes);
        res.send(notes[notes.length - 1]);
      } else {
        res.status(400).send("Missing Payload");
      }
    });

  app.delete('/api/notes/:id', (req, res) => {
    // Request to Delete existing note
    // Convert id to an array index
    // Make sure the index is valid before deleting
    debug("DELETE NOTE", req.params);
    const index = req.params.id - 1; // app idx starts at 1 array idx at 0
    let notes = loadNotes();
    if (index >= 0 && index < notes.length) {
      // Remove the note at index 'index' from the array 
      // re-index the Notes
      // Save the array to file
      // Return the removed note
      let removed = notes.splice(index, 1);
      indexNotes(notes);
      saveNotes(notes);
      res.send(removed[0]);
    } else {
      res.status(404).send("Invalid Index");
    }
  });

  // GET (Default Route, Anything not caught above will filter here)
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path_public });
  });

  // Start the server
  app.listen(port, () => console.log(`Note app listening on port http://localhost:${port}`));
}

//*****************************************************************************
// Kickoff the application
//*****************************************************************************
init();
