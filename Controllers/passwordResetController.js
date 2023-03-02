const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

//getlink page
exports.getLinkPage = async(req, res) => {
    res.render('passwordreset')
}



//Get reset password link
exports.getLink = async(req, res) => {
    const checkEmail = req.body.email;
    const User = await Users.findOne({ email: checkEmail  }).exec();
    if (!User) {
        return res.json({ status: "User does not Exists!" });
    }
    try {
        const secret = process.env.JWT_ACCESS_SECRET + User.password;
        const token = jwt.sign({ email: User.email, id: User._id }, secret, {
            expiresIn: "10m",
        });
        const link = `http://localhost:4000/auth/reset-password/${User._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    
        var mailOptions = {
            from: "process.env.EMAIL ",
            to: checkEmail,
            subject: "Password Reset",
            text: link,
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
        console.log(link);
        res.send("sent")
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
};

//verify using jwt if user is valid
exports.verification = async(req, res) => {
    const { id, token } = req.params;
    const User = await Users.findOne({ _id: id }).exec();
    if (!User) {
        return res.json({ status: "User Does Not Exists!!" });
    }
    const secret = process.env.JWT_ACCESS_SECRET + User.password;
    try {
        jwt.verify(token, secret);
        res.send("Verified");
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
};

//reset password
exports.reset = async(req, res) => {
    const { id, token } = req.params;
    const password = req.body.password;
  
    const User = await Users.findOne({ _id: id });
    if (!User) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_ACCESS_SECRET + User.password;
    try {
        jwt.verify(token, secret);
        let encryptedPassword = await bcrypt.hash(password, 10);
        await Users.updateOne(
            {
            _id: id
            },
            {
            $set: {
                password: encryptedPassword,
            },
            }
        );
        res.json({ status: "Updated password" });
    }catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
  };