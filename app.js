// modules
const express = require("express");
const path = require("path");
const Notes = require("./notes");

// globals
const _debug = process.argv[2] === "debug";
const app = express();
const port = process.env.PORT || 3000;
const path_public = path.join(__dirname, "public"); // Need an absolute path

/**
 * Print output if in debug mode
 *
 * @param  {...any} str
 */
function debugOut(...str) {
  if (_debug) {
    console.log(...str);
  }
}

/**
 * Initialize the Webserver and Notes array then run the Webserver
 */
function init() {
  // Load the notes from the database
  let notes = new Notes();
  notes.load(true);

  // Serve static files from public directory
  app.use(express.static("public"));

  // Need these in order to handle API requests
  //(extended needs to be set to something or you get a warning).
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.sendFile("index.html", { root: path_public });
  });
  app.get("/notes", (req, res) => {
    // Return the notes html page
    res.sendFile("notes.html", { root: path_public });
  });

  // Route [get, post] /api/notes
  app.route("/api/notes")
    .get((req, res) => {
      debugOut("GET ALL NOTES");
      res.json(notes.load());
    })

    .post((req, res) => {
      debugOut("POST NOTE BODY", req.body);
      let newNote = notes.add(req.body);
      if (newNote) {
        res.json(newNote);
      } else {
        // Something was wrong with the body
        res.send("Missing Payload", 400);
      }
    });

  app.delete("/api/notes/:id", (req, res) => {
    debugOut("DELETE NOTE", req.params);
    const index = req.params.id - 1; // Convert 1-based to 0-based index
    const deletedNote = notes.remove(index);
    if (deletedNote) {
      res.json(deletedNote);
    } else {
      res.send("Invalid Index", 404);
    }
  });

  // GET (Default Route, Anything not caught above will filter here)
  app.get("*", (req, res) => {
    debugOut("Default URL", req.url);
    res.redirect("/");
  });

  // Start the server
  app.listen(port, () =>
    console.log(`Note app listening on port http://localhost:${port}`)
  );
}

//*****************************************************************************
// Kickoff the application
//*****************************************************************************
init();
