require('dotenv').config();
const fs = require('fs');
const path = require('path');
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.r4ows.mongodb.net/${process.env.DEFAULT_DATABASE}?retryWrites=true&w=majority`;
const express = require('express');
const helmet = require("helmet");
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { notFound, get500 } = require('./controllers/error');
const User = require('./models/user');
const app = express();
const csrfProtection = csrf();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const access_log_stream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: access_log_stream}))

// for Parsing texts
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', get500);
app.use(notFound);

app.use((error, req, res, next) => {
    res.redirect('/500')
});


mongoose.connect(MONGODB_URI).then(result => {
    app.listen(process.env.PORT || 3000);
}).catch(err => console.log(err));