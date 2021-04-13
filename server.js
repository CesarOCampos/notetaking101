const express = require('express');
const path = require('path');
const fs = require('fs');

//calls the server on selected port
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "Develop", "public")));

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html')); });
app.get('/notes', (req, res) => { res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html')); });
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/notes', (req, res) => {
    fs.readFile(`./Develop/db/db.json`, (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => { // Saves new note
    let newNote = req.body;

    fs.readFile(`./Develop/db/db.json`, (err, data) => {
        let notesArray = JSON.parse(data);
        newNote.id = notesArray.length + 1; // Add id key to note object
        notesArray.push(newNote);
        notesArray = JSON.stringify(notesArray, null, 2);

        fs.writeFile(`./Develop/db/db.json`, notesArray, (err) => {
            if (err) throw err;
            console.log("Data written to file.");
        })
    })
    res.json(newNote);
});

//  Deletes a note with a specified ID
app.delete('/api/notes/:id', (req, res) => {
    let deleteNoteId = req.params.id;

    (deleteNoteId > 0) ? deleteNoteId-- : console.log("Nothing to delete.");

    fs.readFile(`./Develop/db/db.json`, (err, data) => {
        let notesArray = JSON.parse(data);
        notesArray.splice(deleteNoteId, 1); // Remove note from array
        for (let i = 0; i < notesArray.length; i++) { // Re-number Array
            notesArray[i].id = i + 1;
        }
        notesArray = JSON.stringify(notesArray, null, 2);

        fs.writeFile(`./Develop/db/db.json`, notesArray, (err) => {
            if (err) throw err;
            console.log("Data has been deleted.");
        })
    })
    res.json();
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));