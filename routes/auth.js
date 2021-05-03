const express = require('express');
const router = express.Router();
const { ensureAuthenticated_teacher } = require('../configurations/teacher_checkAuth')

//------------ Importing Controllers ------------//
const authController = require('../controls/authController');
const authController_teacher = require('../controls/authController_teacher');

// ---------------- MENU ---------------//
router.get('/r', (req, res) => res.render('menu_register'));
router.get('/l', (req, res) => res.render('menu_login'));

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));



// ----------- Teacher Login Handle ----------//
router.get('/teacher/login', (req, res) => res.render('teacher_login'));



//------------ Forgot Password Route ------------//
// router.get('/forgot', (req, res) => res.render('forgot'));

// //------------ Reset Password Route ------------//
// router.get('/reset/:id', (req, res) => {
//     // console.log(id)
//     res.render('reset', { id: req.params.id })
// });

//------------ Student Register Route ------------//
router.get('/register', (req, res) => res.render('register'));

// ----------- Teacher Register Handle ----------//
router.get('/teacher', (req, res) => res.render('teacher_register'));

//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);


//------------ teacher Register POST Handle ------------//
router.post('/teacher', authController_teacher.teacher_registerHandle);

//------------ Teacher Email ACTIVATE Handle ------------//
router.get('/teacher/activate/:token', authController_teacher.teacher_activateHandle);


//------------ Forgot Password Handle ------------//
// router.post('/forgot', authController.forgotPassword);

// //------------ Reset Password Handle ------------//
// router.post('/reset/:id', authController.resetPassword);

// //------------ Reset Password Handle ------------//
// router.get('/forgot/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);


//------------ Teacher Login POST Handle ------------//
router.post('/teacher/login', authController_teacher.teacher_loginHandle);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

module.exports = router;