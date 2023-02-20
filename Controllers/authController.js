const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

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
