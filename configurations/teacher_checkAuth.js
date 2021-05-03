//------------ Routing via Auth ------------//
module.exports = {
    ensureAuthenticated_teacher: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        console.log("this ran now");
        req.flash('error_msg', 'Please log in first!');
        res.redirect('/auth/teacher/login');
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/t/dashboard');
    }
};