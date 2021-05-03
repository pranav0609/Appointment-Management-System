//------------ Routing via Auth ------------//
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        console.log("this ran");
        req.flash('error_msg', 'Please log in first!');
        res.redirect('/auth/login');
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/s/dashboard');
    }
};