// load express and router
const router = require('express').Router();
// load file system for read/write functions
const fs = require('fs');
// link db.json for saved notes
const db = require('./../db/db.json');
// load uuid for unique IDs
const {v4: uuidv4} = require('uuid');

// get existing notes
router.get('/notes', (req, res) => {
    // read db.json to get the saved notes
    res.json(db);
});

// add a note
router.post('/notes', (req, res) => {
    // receive new note from request body
    let newNote = req.body;
    // add unique ID to new note
    newNote.id = uuidv4();
    // add new note to saved notes
    let savedNotes = db;
    savedNotes.push(newNote);
    // push new saved notes array to db.json
    savedNotes = JSON.stringify(savedNotes)
    fs.writeFile('db/db.json', savedNotes, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('added new note to db.json');
            // return new note to client
            res.json(newNote);
        };
    });
});

// delete a note
router.delete('/notes/:id', (req, res) => {
    // receive query param of id
    const deleteID = req.params.id;

    // read db.json and store parsed array of saved notes 
    let savedNotes = JSON.parse(fs.readFileSync('db/db.json'));
    
    // filter notes by the delete id to create a new array
    let newSavedNotes = savedNotes.filter(note => note.id != deleteID);

    // get title of deleted note
    const deletedNote = savedNotes.filter(note => note.id == deleteID);
    const deletedTitle = deletedNote[0].title;
    
    // rewrite saved notes array to exclude selected id
    fs.writeFileSync('db/db.json', JSON.stringify(newSavedNotes))
            
    // alert user to deletion and send back the updated array of notes
    console.log(`note '${deletedTitle}' deleted`);
    res.json(newSavedNotes);
});

module.exports = router;