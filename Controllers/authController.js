const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/Users');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() 
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
    'signup',
    new localStrategy(
        {
            first_name: 'first_name',
            last_name: 'last_name',
            email: 'email',
            username: 'username',
            password: 'password'
        },
        async (first_name, username, email, password, done) => {
            try {
                const user = await User.create({ first_name, last_name, email, password, username });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
    'login',
    new localStrategy(
        {
            email: 'email',
            password: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);






































































// const jwt = require("jsonwebtoken");
// const router = require("express").Router();
// const User = require("../models/User");
// const bcrypt = require("bcrypt");

// //REGISTER
// router.post("/register", async (req, res) => {
//     const checkEmail = req.body.email;
//     const emailExists = await Users.findOne({email: checkEmail }).exec();
//     if (emailExists) { 
//         return res.status(409).json({"message": "Email already in use"})//conflict
//     }
//     else if (req.body.password != req.body.passwordConfirm) {
//         return res.status(400).json({"message": "Password dont match"})      
//     };
//     try {
//         let hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const newUser = new User({
//             first_name:req.body.first_name,
//             last_name:req.body.last_name,
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPass,
//         });

//         const user = await newUser.save();
//         res.status(200).json(user);
//     } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     !user && res.status(400).json("Wrong credentials!");

//     const validated = await bcrypt.compare(req.body.password, user.password);
//     !validated && res.status(400).json("Wrong credentials!");

//     const { password, ...others } = user._doc;
//     res.status(200).json(others);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;