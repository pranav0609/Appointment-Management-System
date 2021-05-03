// ----------- Teacher Model --------//
const Teacher = require('../models/teacher');
const {Schedule} = require("../models/teacher_schedule");
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";

//------------ Register Handle ------------//
exports.teacher_registerHandle = (req, res) => {
    const { name, email, subject, password, password2 } = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email  || !subject || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('teacher_register', {
            errors,
            name,
            email,
            subject,
            password,
            password2
        });
    } else {
        //------------ Validation passed ------------//
        Teacher.findOne({ email: email }).then(teacher => {
            if (teacher) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('teacher_register', {
                    errors,
                    name,
                    email,
                    subject,
                    password,
                    password2
                });
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, subject, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/auth/teacher/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "nodejsa@gmail.com",
                        clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                        clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                        refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"Auth Admin" <nodejsa@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification: NodeJS Auth ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash(
                            'error_msg',
                            'Something went wrong on our end. Please register again.'
                        );
                        res.redirect('/auth/teacher/login');
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        res.redirect('/auth/teacher/login');
                    }
                })

            }
        });
    }
}

//------------ Activate Account Handle ------------//
exports.teacher_activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/auth/teacher');
            }
            else {
                const { name, email, subject,  password } = decodedToken;
                Teacher.findOne({ email: email }).then(teacher => {
                    if (teacher) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error_msg',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/auth/teacher/login');
                    } else {
                        const newTeacher = new Teacher({
                            name,
                            email,
                            subject,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newTeacher.password, salt, async (err, hash) => {
                                if (err) throw err;
                                newTeacher.password = hash;
                                await newTeacher
                                    .save()
                                    .then(teacher => {
                                        req.flash(
                                            'success_msg',
                                            'Account activated. You can now log in.'
                                        );
                                        res.redirect('/auth/teacher/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}


//------------ Login Handle ------------//
exports.teacher_loginHandle = (req, res, next) => {
    passport.authenticate('local', {        
        successRedirect: '/t/dashboard',
        failureRedirect: '/auth/teacher/login',
        failureFlash: true
    })(req, res, next);
}

exports.teacher_schedule = async (req, res) => {
    const { name, subject, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday} = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!Monday || !Tuesday || !Wednesday || !Thursday || !Friday || !Saturday || !Sunday) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        res.render('teacher_schedule', {
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday
    });
}

    const newSchedule = new Schedule({
        name,
        subject,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday
    });

    await newSchedule
        .save()
        .then(schedule => {
        req.flash(
        'success_msg',
        'Slots saved'
        );
        res.redirect('/t/dashboard/schedule');
        })
        .catch(
            () => {
                req.flash(
                    'error_msg',
                    'Cound not save'
                );
            res.redirect('/t/dashboard/schedule');
            }
            
        )


}

//------------ Logout Handle ------------//
exports.teacher_logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/teacher/login');
}