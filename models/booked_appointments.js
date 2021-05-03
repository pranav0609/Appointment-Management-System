const mongoose = require('mongoose');

//------------ User Schema ------------//
const bookSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true
  },
  teacher_name: {
    type: String,
    required: true
  },
  Subject: {
    type: String,
    required: true
  },
  Topic: {
    type: String,
    required: true
  },
  Day: {
      type: String,
      required: true
  },
  doubt: {
      type: String,
      required: true
  },
  Accepted: {
      type: Boolean,
      default: null
  },
  Message: {
    type: String,
    default: "NA"
  },
  resetLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Booked = mongoose.model('Booked', bookSchema);

exports.Booked = Booked;