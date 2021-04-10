const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Sets up the Express App Server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.get('/notes', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'notes.html')); });
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/notes', (req, res) => {
    fs.readFile(`./db/db.json`, (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        res.json(notes);
    });
});

// Saves new note
app.post('/api/notes', (req, res) => {
    // req.body is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    let newNote = req.body;

    fs.readFile(`./db/db.json`, (err, data) => {
        let notesArray = JSON.parse(data);
        // Add id key to note object
        newNote.id = notesArray.length + 1;
        notesArray.push(newNote);
        notesArray = JSON.stringify(notesArray, null, 2);

        fs.writeFile(`./db/db.json`, notesArray, (err) => {
            if (err) throw err;
            console.log("Data written to file.");
        })
    })
    res.json(newNote);
});

//  Deletes a note with a specified ID
app.delete('/api/notes/:id', (req, res) => {

    let delNoteId = req.params.id;

    if (delNoteId > 0) {
        delNoteId--;
    } else {
        console.log("There are no items to delete.");
    }

    fs.readFile(`./db/db.json`, (err, data) => {
        let notesArray = JSON.parse(data);
        // Remove note from array
        notesArray.splice(delNoteId, 1);

        // Re-number Array
        for (let i = 0; i < notesArray.length; i++) {
            notesArray[i].id = i + 1;
        }
        notesArray = JSON.stringify(notesArray, null, 2);
        //writeToFile();

        fs.writeFile(`./db/db.json`, notesArray, (err) => {
            if (err) throw err;
            console.log("New reduced data written to file after delete.");
        })
    })
    res.json();
});

// function writeToFile(`./db/db.json`, notesArray, ) {
//     //console.log("writing to html perhaps");
//     fs.writeFile(`./db/db.json`, notesArray, (err) =>
//         err ? console.error(err) : console.log('Success! Data written to file.'));
// }

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));