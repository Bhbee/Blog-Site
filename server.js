require("dotenv").config()
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const methodOverride = require('method-override')
const app = express();

const cors = require("cors");
const corsOPtion = require("./config/corsOPtion")

const verifyJWT = require("./middewares/verifyJWT");
const cookieParser = require('cookie-parser')
const credentials = require('./middewares/credentials')
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
const connectDb = require('./config/dbConfig') //database configuration requirement
const PORT = process.env.PORT || 4000


//connect to database
connectDb();
//ejs
app.set('view engine', 'ejs')
app.use(expressLayouts)
//middlewares
//app.use(credentials) //for header-authorization 
app.use(cors(corsOPtion)) //Cross Origin Resource Sharing
app.use(express.urlencoded({ extended: false })) //built-in middleware to handle url-encoded data(form data)
app.use(express.json());//built-in middleware to handle json data

app.use(cookieParser())

//Routes
app.use('/', require('./routes/index')) //list of published blogs
app.use('/auth', require('./routes/auth'));

app.use(verifyJWT);
app.use('/articles', require('./routes/articles'))
const router = express.Router();


mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
    app.listen(PORT, ()=> console.log('app is running'));
})