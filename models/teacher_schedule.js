const mongoose = require('mongoose');

//------------ User Schema ------------//
const scheduleSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  Monday: {
    type: String,
    required: true,
  },
  Tuesday: {
    type: String,
    required: true,
  },
  Wednesday: {
    type: String,
    required: true,
  },
  Thursday: {
    type: String,
    required: true,
  },
  
  Friday: {
    type: String,
    required: true,
  },

  Saturday: {
    type: String,
    required: true,
  },

  Sunday: {
    type: String,
    required: true,
  },
  
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);


function validateSchedule(schedule) {
    const schema = {
        Monday: Joi.string().min(4).max(19).required(),
        Tuesday: Joi.string().min(4).max(19).required(),
        Wednesday: Joi.string().min(4).max(19).required(),
        Thursday: Joi.string().min(4).max(19).required(),
        Friday: Joi.string().min(4).max(19).required(),
        Saturday: Joi.string().min(4).max(19).required(),
        Sunday: Joi.string().min(4).max(19).required(),
    };

    return Joi.validate(schedule, schema);
}

exports.Schedule = Schedule;