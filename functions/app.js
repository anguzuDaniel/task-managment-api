require('dotenv').config();
const express = require('express');
const session = require('express-session')
const authRouter = require('../routes/auth');
const path = require('path');
const passport = require('../models/Passport');
const logger = require('morgan');
const crypto = require('crypto');
const flash = require('connect-flash');
const  { connectToDatabase } = require('../db');
const taskRouter = require('../routes/taskRouter');
const serverless = require('serverless-http');

const app = express();
const SQLiteStore = require('connect-sqlite3')(session);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
    secret: process.env.session || 'your secret key', 
    resave: false, 
    saveUninitialized: false,
    store: new SQLiteStore({ db: '../sessions.db', dir: '../' }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Connect to the database once
let database;

(async () => {
    try {
        database = await connectToDatabase();

        console.log("Database: " + database);

        console.log('Connect: Connected to MongoDB Atlas');

    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
})();

app.use('/.netlify/functions/', authRouter)

app.use('/.netlify/functions/api/v1/tasks', taskRouter)

module.exports.handler = serverless(app)