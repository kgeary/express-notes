// modules
const express = require('express')
const path = require('path')
const fs = require('fs')

// globals
const app = express();
const port = 3000;
const path_public = path.join(__dirname, 'public'); // Need an absolute path

/** 
  * Load notes from db file into array
  * 
  * @returns 
  * The notes object array
  */
function loadNotes() {
  let notes;
  try {
    const data = fs.readFileSync('./db/db.json', 'utf8');
    notes = JSON.parse(data);
    indexNotes(notes);
    console.log("NOTES", notes);
  } catch (err) {
    notes = [];
  }
  return notes;
}

/** 
  * Save Notes Array to file
  * 
  * @param notes The notes object array
  */
function saveNotes(notes) {
  indexNotes(notes);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
}


/** 
  * Re-index the IDs of the notes object array following a deletion
  * 
  * @param notes The notes object array
  */
function indexNotes(notes) {
  notes.forEach((el, index) => el.id = index + 1);
}

/**
 * Initialize the Webserver and Notes array then run the Webserver 
 */
function init() {
  // Load the notes from the database
  let notes = loadNotes();

  // Serve static files from public directory
  app.use(express.static('public'));

  // Need these in order to handle API requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Setup Routing
 
  //***************************
  // GET /notes
  //***************************
  app.get('/notes', (req, res) => {
    res.sendFile('notes.html', { root: path_public });
  });

  //***************************
  // GET /api/notes
  //***************************
  app.get('/api/notes', (req, res) => {
    // Request to get all notes
    console.log("GET NOTES");
    res.send(notes);
  });

  //***************************
  // POST /api/notes
  //***************************
  app.post('/api/notes', (req, res) => {
    // Request to add new note
    console.log("POST NOTE BODY", req.body);
    // Make sure the
    if (req.body) {
      // Create a new ID field in the object
      req.body.id = notes.length + 1;
      // Push the new note to the array
      notes.push(req.body);
      // Write the array to file
      saveNotes(notes);
      // Send the response
      res.send(notes[notes.length - 1]);
    } else {
      res.status(400).send("Missing Payload");
    }
  });

  //***************************
  // DELETE /api/notes/:id
  //***************************
  app.delete('/api/notes/:id', (req, res) => {
    // Request to Delete existing note
    console.log("DELETE NOTE", req.params);
    // Convert ID into Array index
    const index = req.params.id - 1;
    // Make sure the index is valid
    if (index >= 0 && index < notes.length) {
      // Remove that index from the array then update db.json
      let removed = notes.splice(index, 1);
      saveNotes(notes);
      res.send(removed[0]);
    } else {
      res.status(404).send("Invalid Index");
    }
  });

  //***************************
  // GET (Default Route)
  //***************************
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path_public });
  });

  //***************************
  // Start the server
  //***************************
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

// Kickoff the application
init();
