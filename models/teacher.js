const mongoose = require('mongoose');

//------------ User Schema ------------//
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    enum: ['Mini Project', 'AOA', 'TACD', 'RDBMS', 'OSTPL', 'PSOT', 'Audit Course'],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  verified: {
    type: Boolean,
    default: false
  },
  resetLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = exports = Teacher;