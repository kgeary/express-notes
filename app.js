const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

let notes;

function loadNotes() {
  try {
    const data = fs.readFileSync('./db/db.json', 'utf8');
    notes = JSON.parse(data);
    indexNotes();
    console.log("NOTES", notes);  
  } catch(err) {
    notes = [];
  }
}

function writeNotes() {
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
}

function indexNotes() {
  notes.forEach((el, index) => el.id = index + 1);
}

async function init() {
  // Serve static files from public directory
  app.use(express.static('public'));
  
  // Do I need this?
  app.use(express.urlencoded());
  // Process JSON posts
  app.use(express.json());

  // Setup Routing
  app.get('/notes', (req, res) => res.sendFile('notes.html', { root: path.join(__dirname, 'public') }));
  app.get('/api/notes', (req, res) => res.sendFile('db.json', { root: path.join(__dirname, 'db') }));
  app.post('/api/notes', (req, res) => {
    // add new note
    console.log("POST NOTE BODY", req.body);

    if (req.body) {
      req.body.id = notes.length + 1;
      notes.push(req.body);
      writeNotes();
    }
    res.sendFile('notes.html', { root: path.join(__dirname, 'public')});
  });

  app.delete('/api/notes/:id', (req, res) => {
    // delete existing note
    console.log("DELETE NOTE", req.params);
    
    const index = req.params.id-1;
    if (index >= 0 && index < notes.length) {
      // VALID INDEX
      notes.splice(index, 1);
      indexNotes();
      writeNotes();
    }
    res.sendFile('notes.html', { root: path.join(__dirname, 'public')});
  });

  app.get('*', (req, res) => res.sendFile('index.html'));

  // Load the database
  loadNotes();
  
  // Start the server
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

init();
