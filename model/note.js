const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  
  content: String,
  priority: {
    type: String,
    enum: ['important', 'urgent','miscellaneous', 'normal'],
    default: 'normal'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
