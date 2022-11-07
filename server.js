require("dotenv").config()
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const app = express();

const passport = require('passport');
const mongoose = require('mongoose')
const connectDb = require('./config/dbConfig')

require("./Controllers/authController")
const PORT = process.env.PORT || 3000

//connect to database
connectDb();

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ extended: false }));



app.use('/books', passport.authenticate('jwt', { session: false }), booksRoute);


//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/blogs', require('./routes/blogs'))
const router = express.Router();

// Handle errors.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});


app.listen(PORT, console.log("server started"))