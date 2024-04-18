// Authentication middleware function
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('Authenticated Successfuly!!!!!');
        return next(); // User is authenticated, continue to the next middleware
    } else {
        res.redirect('/login'); // Redirect unauthorized users to the login page
    }
}