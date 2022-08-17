// load express and router
const router = require('express').Router();
// load file system for read/write functions
const fs = require('fs');
// link db.json for saved notes
const db = require('./../db/db.json');
// load uuid for unique IDs
const { v4: uuidv4 } = require('uuid');

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

    // read db.json to get saved notes array
    return new Promise((resolve, reject) => {
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return
            };

            // parse db.json into savedNotes array
            const savedNotes = JSON.parse(data);
            // filter out note with delete id and save as newSavedNotes array
            let newSavedNotes = savedNotes.filter(note => note.id != deleteID);

            // get title of deleted note
            const deletedNote = savedNotes.filter(note => note.id == deleteID);
            const deletedTitle = deletedNote[0].title;

            resolve({
                ok: true,
                deletedTitle: deletedTitle,
                newSavedNotes: newSavedNotes
            })
        })
    })
    // write new db.json file without deleted note
    .then(response => {
        if (response.ok) {
            fs.writeFile('db/db.json', JSON.stringify(response.newSavedNotes), (err) => {
                if (err) {
                    console.error(err);
                };

                console.log(`note '${response.deletedTitle}' deleted`);

                // return newSavedNotes as response to delete api call
                res.json(response.newSavedNotes);
            })
        };
    })
    .catch(err => console.error(err));
});

module.exports = router;