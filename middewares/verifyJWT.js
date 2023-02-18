const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')) return res.render('login');   
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
        (err, decoded) =>{
            if(err){
                return res.sendStatus(403); //forbidden, invalid token
            }
            req.user = decoded.UserInfo.username;
            req.userEmail = decoded.UserInfo.email;
            next();
        }
    )
}

module.exports = verifyJWT;