const router = require('express').Router();
const fs = require('fs');
const db = require('./../db/db.json');
const {v4: uuidv4} = require('uuid');

router.get('/notes', (req, res) => {
    // read db.json to get the saved notes
    res.json(db);
});

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

// router.delete('notes/:id', (req, res) => {
//     // receive query param of id
//     // read saved notes
//     // filter saved notes by id
//     // rewrite saved notes to remove selected id
//     // return saved notes to client
// });

module.exports = router;