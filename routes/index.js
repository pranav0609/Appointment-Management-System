const express = require('express');
const router = express.Router();

const {Booked} = require('../models/booked_appointments')

const { Schedule } = require('../models/teacher_schedule');
const { ensureAuthenticated } = require('../configurations/checkAuth');

const authController = require('../controls/authController')

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});


//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
}));


router.get('/dashboard/teacher_schedule', ensureAuthenticated, async (req, res) => {
    await Schedule.find({}, function(err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render("teacher_schedule_for_students", { details: allDetails })
        }
    })
});

router.get('/dashboard/book', ensureAuthenticated, (req, res) => res.render('student_booking', {
    student_name: req.user.name
}));

//-------- Booking the appointment from student side --------//
router.post('/dashboard/book', authController.BookingHandle);

module.exports = router;

// ----------- Checking students appointments ---------//

router.get('/dashboard/appointments', ensureAuthenticated, async (req, res) => {
    await Booked.find({student_name: req.user.name}, function(err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render("appointments", { details: allDetails })
        }
    })
});
