const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
//let errors = [];

exports.signup = async (req, res) => {
    const checkEmail = req.body.email;
    const emailExists = await Users.findOne({email: checkEmail }).exec();
    if (emailExists) { 
        //errors.push({ msg: 'Email already in use' });
        return res.status(409).json({"message": "Email already in use"})//conflict
    }
    else if (req.body.password != req.body.passwordConfirm) {
        //errors.push({ msg: 'Passwords do not match' });
        return res.status(400).json({"message": "Password do not match"})      
    }
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 12);
        const info ={
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "username": req.body.username,
            "email": req.body.email,
            "password": hashedPassword,
        };
        await Users.create(info)
            res.redirect('/auth/sign-in')
            //return res.status(201).json({"message": "User registered"})//success 
    }
    catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.signin = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({'message': 'email and password are required'})
    const userFound = await Users.findOne({email: email }).exec();
    if(!userFound) return res.sendStatus(401) //unauthorized     
    const password_valid = await bcrypt.compare(password, userFound.password)
    
    if(password_valid){
        //create jwt
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "username": userFound.username,
                    "email": userFound.email
                }
            },
            process.env.JWT_ACCESS_SECRET, 
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
        );
        const refreshToken = jwt.sign(
            { "username": userFound.username }, 
            process.env.JWT_REFRESH_SECRET, 
            {expiresIn: process.env.RERESH_TOKEN_EXPIRES_IN}
        );
        //save refresh_token to current user
        userFound.refreshToken = refreshToken;
        await userFound.save();
    
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); //secure: true(add bk later for chrome security in production)
        
        res.redirect('/')
        console.log(accessToken)
        //res.json({accessToken});

    }
    else{
        res.status(200).json({"message": "Invalid password or username"});
    } 
}


exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401); 
    const refreshToken = cookies.jwt;

    const userFound = await Users.findOne({ refreshToken }).exec();
    if (!userFound) return res.sendStatus(403) //forbidden 
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) =>{
            if(err || userFound.username !== decoded.username) return res.sendStatus(403) //forbidden
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                     "username": decoded.username,
                     "email": userFound.email
                    }
                },
            
                process.env.JWT_ACCESS_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
            );
            res.json({accessToken})
        }
    ); 
}

exports.logout = async  (req, res) => {
    //on client side, also delete accessToken
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204)//no content
    const refreshToken = cookies.jwt;

    const userFound = await Users.findOne({ refreshToken}).exec();
    
    if(!userFound) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'})
        return res.sendStatus(204);
    }
    //delete refreshtoken in db
    userFound.refreshToken = '';
    await userFound.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'});
    res.sendStatus(204);
}


























































// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
// const User = require('../models/Users');

// const JWTstrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;

// passport.use(
//     new JWTstrategy(
//         {
//             secretOrKey: process.env.JWT_SECRET,
//             jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() 
//         },
//         async (token, done) => {
//             try {
//                 return done(null, token.user);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );

// // This middleware saves the information provided by the user to the database,
// // and then sends the user information to the next middleware if successful.
// // Otherwise, it reports an error.
// passport.use(
//     'signup',
//     new localStrategy(
//         {
//             first_name: 'first_name',
//             last_name: 'last_name',
//             email: 'email',
//             username: 'username',
//             password: 'password'
//         },
//         async (first_name, username, email, password, done) => {
//             try {
//                 const user = await User.create({ first_name, last_name, email, password, username });

//                 return done(null, user);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );

// // This middleware authenticates the user based on the email and password provided.
// // If the user is found, it sends the user information to the next middleware.
// // Otherwise, it reports an error.
// passport.use(
//     'login',
//     new localStrategy(
//         {
//             email: 'email',
//             password: 'password'
//         },
//         async (email, password, done) => {
//             try {
//                 const user = await User.findOne({ email });

//                 if (!user) {
//                     return done(null, false, { message: 'User not found' });
//                 }

//                 const validate = await user.isValidPassword(password);

//                 if (!validate) {
//                     return done(null, false, { message: 'Wrong Password' });
//                 }

//                 return done(null, user, { message: 'Logged in Successfully' });
//             } catch (error) {
//                 return done(error);
//             }
//         }
//     )
// );






































































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