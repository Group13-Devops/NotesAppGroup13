require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
// HTTPS 
const https = require('https');
const fs = require('fs');

const mongoose = require('mongoose');
const Note = require('./model/note');
const uri = process.env.DATABASE_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// this is for overriding the _method field (to fix the Delete issue)
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));
  


//Routes 
app.get('/', (req, res) => {
    res.redirect('/index');
  });

  app.get('/index', async (req, res) => {
    const notes = await Note.find();
    res.render('index', { notes });
  });
  
// Create a new Note

app.post('/notes', async (req, res) => {
    try {
      const note = new Note({
        content: req.body.content,
        priority: req.body.priority
      });
  
      const savedNote = await note.save();
      res.redirect(`/notes/${savedNote._id}`);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  });
  

  // Retrieve all Notes
  app.get('/notes', (req, res) => {
    Note.find()
      .then(notes => res.render('notes_list', { notes }))
      .catch(err => res.status(500).send({ message: err.message || 'Error retrieving Notes' }));
  });
  

  // Render the new note form
app.get('/notes/new', (req, res) => {
    res.render('new_note');
  });
  
  // Retrieve a single Note by id
  app.get('/notes/:id', async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send({ message: 'Note not found' });
      }
      res.render('note_details', { note });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Note not found' });
      }
      res.status(500).send({ message: err.message || 'Error retrieving Note' });
    }
  });
  
  // Retrieve a single Note by id for editing
app.get('/notes/:id/edit', (req, res) => {
    Note.findById(req.params.id)
      .then(note => {
        if (!note) {
          return res.status(404).send({ message: 'Note not found' });
        }
        res.render('edit_note', { note });
      })
      .catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({ message: 'Note not found' });
        }
        res.status(500).send({ message: err.message || 'Error retrieving Note' });
      });
  });
  
  // Update a Note by id

  
    app.put('/notes/:id', async (req, res) => {
        if (!req.body.content) {
          return res.status(400).send({ message: 'Note content cannot be empty' });
        }
      
        try {
          const note = await Note.findByIdAndUpdate(req.params.id, {
            content: req.body.content,
            priority: req.body.priority
          }, { new: true });
      
          if (!note) {
            return res.status(404).send({ message: 'Note not found' });
          }
          res.redirect(`/notes/${note._id}`);
        } catch (err) {
          if (err.kind === 'ObjectId') {
            return res.status(404).send({ message: 'Note not found' });
          }
          res.status(500).send({ message: err.message || 'Error updating Note' });
        }
      });
      
  
  // Delete a Note by id
  app.delete('/notes/:id', (req, res) => {
    Note.findByIdAndRemove(req.params.id)
      .then(note => {
        if (!note) {
          return res.status(404).send({ message: 'Note not found' });
        }
        res.redirect('/index');
      })
      .catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({ message: 'Note not found' });
        }
        res.status(500).send({ message: err.message || 'Error deleting Note' });
      });
  });
  


const port = process.env.PORT || 4000;
// ------   HTTPS -------  

const sslOptions = {
  key: fs.readFileSync(path.join('privatekey1.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'server1.crt')),
};

// Replace the app.listen() call with the following
const server = https.createServer(sslOptions, app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*   ----   http  ------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});     */
