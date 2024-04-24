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

const MongoStore = require('connect-mongo')(session);

const app = express();

const PORT = process.env.PORT || 3000;

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
    store: new MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'task-manager',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
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