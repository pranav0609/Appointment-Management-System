const express = require('express');
const router = express.Router();

const {Booked} = require('../models/booked_appointments')

const { ensureAuthenticated_teacher } = require('../configurations/teacher_checkAuth')
const authController_teacher = require('../controls/authController_teacher');

// //------------ Welcome Route ------------//
// router.get('/', (req, res) => {
//     res.render('welcome');
// });

router.get('/dashboard', ensureAuthenticated_teacher, (req, res) => res.render('teacher_dash', {
    name: req.user.name
}));

router.get('/dashboard/schedule', ensureAuthenticated_teacher, (req, res) => res.render('teacher_schedule', {
    name: req.user.name,
    subject: req.user.subject
}));


router.get('/dashboard/bookings', ensureAuthenticated_teacher, async (req, res) => {
    await Booked.find({teacher_name: req.user.name}, function(err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render("bookings_teacher", { details: allDetails })
        }
    })
});

//------------ Teacher slot saving ------------------//
router.post('/dashboard/schedule', authController_teacher.teacher_schedule);

// ------- rejecting appointment --------------------//
router.delete('/dashboard/bookings', async (req, res) => {
    await Booked.findOneAndUpdate({ _id: req.body.id }, {Accepted: false, Message: req.body.message}, { new: true }, () => {
        req.flash(
            'success_msg',
            'Appointment rejected'
        )
        res.redirect('/t/dashboard/bookings');
});
})
//----------- Accepting appointment -------------------//
router.put('/dashboard/bookings', async (req, res) => {
    Booked.findOneAndUpdate({ _id: req.body.id }, {Accepted: true, Message: req.body.message}, { new: true }, () => {
        req.flash(
            'success_msg',
            'Appointment accepted'
        )
        res.redirect('/t/dashboard/bookings');
               
});
})




module.exports = router;