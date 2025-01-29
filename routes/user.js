const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

router.post('/signup', (req, res) => {
    let user = req.body;
    let query = "select email, password, role, status from user where email=?";
    console.log('Executing signup query:', query);
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            console.log('Signup query results:', results);
            if (results.length <= 0) {
                query = "insert into user (name, contactNumber, email, password, status, role) values(?, ?, ?, ?, 'false', 'user')";
                console.log('Executing insert query:', query);
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        console.log('User successfully registered:', user);
                        return res.status(200).json({ message: "Successfully Registered" });
                    } else {
                        console.log('Error inserting user:', err);
                        return res.status(500).json(err);
                    }
                });
            } else {
                console.log('Email already exists:', user.email);
                return res.status(400).json({ message: "Email already exists" });
            }
        } else {
            console.log('Error executing signup query:', err);
            return res.status(500).json(err);
        } 
    });
});

router.post('/login', (req, res) => {
    const user = req.body;
    console.log('Request body:', user);
    const query = "select email, password, role, status from user where email=?";
    console.log('Executing login query:', query);
    console.log('Login email:', user.email);
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            console.log('Login query results:', results);
            if (results.length <= 0) {
                console.log('No user found with this email');
                return res.status(401).json({ message: "Incorrect Username or password" });
            } else if (results[0].password != user.password) {
                console.log('Password mismatch');
                console.log('Stored password:', results[0].password);
                console.log('Provided password:', user.password);
                return res.status(401).json({ message: "Incorrect Username or password" });
            } else {
                console.log('User status:', results[0].status);
                console.log('User password:', results[0].password);
                console.log('Provided password:', user.password);

                if (results[0].status === 'false') {
                    console.log('Wait for Admin Approval');
                    return res.status(401).json({ message: "Wait for Admin Approval" });
                } else if (results[0].password == user.password) {
                    const response = { email: results[0].email, role: results[0].role };
                    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                    console.log('Login successful, token generated');
                    res.status(200).json({ token: accessToken });
                } else {
                    console.log('Something went wrong');
                    return res.status(400).json({ message: "Something went wrong. Please try again later" });
                }
            }
        } else {
            console.log('Database error:', err);
            return res.status(500).json(err);
        }
    });
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    const query = "select email, password from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your email" });
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password by KahawaYetu App",
                    html: `<p><b>Your Login details of Kahawa Zetu App</b><br><b>Email:</b> ${results[0].email}<br><b>Password:</b> ${results[0].password}<br><a href="http://localhost:4200/">Click here to login</a></p>`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.status(500).json(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({ message: "Password sent successfully to your email" });
                    }
                });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;