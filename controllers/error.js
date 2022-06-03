exports.notFound = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Not Found',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500 = (req, res, next) => {
    res.status(404).render('500', {
        pageTitle: 'Error!',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    });
};