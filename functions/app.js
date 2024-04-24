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
const cors = require('cors');

const mongoose = require('mongoose')
const MongoStore = require('connect-mongo');

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(cors());

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

app.use('/', authRouter)

app.use('/api/v1/tasks', taskRouter)

app.use(cors({origin: 'http://localhost:8888'}));

module.exports.handler = serverless(app)