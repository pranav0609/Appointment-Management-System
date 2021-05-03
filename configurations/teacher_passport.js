const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//------------ Local User Model ------------//
const Teacher = require('../models/teacher');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            //------------ User Matching ------------//
            await Teacher.findOne({
                email: email
            }).then(teacher => {
                if (!teacher) {
                    return done(null, false, { message: 'This email ID is not registered' });
                }

                //------------ Password Matching ------------//
                bcrypt.compare(password, teacher.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, teacher);
                    } else {
                        return done(null, false, { message: 'Password incorrect! Please try again.' });
                    }
                });
            });
        })
    );

    passport.serializeUser(function (teacher, done) {
        done(null, teacher.id);
    });

    passport.deserializeUser(function (id, done) {
        Teacher.findById(id, function (err, teacher) {
            done(err, teacher);
        });
    });
};