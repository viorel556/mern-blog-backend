import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidator} from './validators/auth.js';
import {validationResult} from "express-validator";
import UserModel from './models/User.js';
import checkAuth from "./utils/checkAuth.js";
// DATABASE SETUP:
// database details:
const dbname = "blog";
const user = 'viorel556';
const password = 'standart1';
const cluster = 'cluster0';
// Connecting to mongoDB by using Mongoose:
mongoose
    .connect(`mongodb+srv://${user}:${password}@${cluster}.xx2rtno.mongodb.net/${dbname}?retryWrites=true&w=majority`)
    .then( () => console.log('DB is OK. ') )
    .catch( (err) => console.log('DB ERROR: ', err) )


// CREATING an app, aka server;
const app = express();

app.use(express.json()); // SET-UP: indicating that our app can READ now json files;

app.get('/', (req, res) => {
    // RECEIVES a get request on homepage and returns a body with "Hello World";
    res.send("HELLO WORLD,. this is some new shit!");
});

app.post('/auth/login', async (req, res) => {

    try {
        // CHECKING if a user exists:
        const user = await UserModel.findOne( { email: req.body.email });
        if(!user) {
            return res.status(404).json({//obj
                message:'User not found!'
            });
        }

        // COMPARING the password with the stored hash via bcrypt:
        const isValidPass = await bcrypt.compare(
            req.body.password,   user._doc.passwordHash
        )
        if (!isValidPass) {
            return req.status(400).json({
                message:'Login or password is incorrect!'
            });
        }

        // HAPPY PATH: if all the above are ok, new token IS CREATED;
        const token = jwt.sign(
            {_id: user._id },
            'secret123',
            { expiresIn: '30d'}
        );
        const {passwordHash, ...userData} = user._doc;
        res.json(
            {
                loggedIn: true,
                ...userData, // we don't want to return the password hash to the user hence line 58;
                token
            }
        );

    }

    catch (err) {
        // UNHAPPY PATH:
        console.log(err); // printing error just for the Devs;
        res.status(500).json(
            {
                message: "Login not possible. Some error has occurred!"
            }
        );
    }

    // // RECEIVES a post request and RETURNS a JSON file:
    // res.json(
    //     {
    //         success: true,
    //         token
    //     },
    // );

});

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        // trying validation:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        // HASHING the password:
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); // salt - is the encryption algorithm;
        const hash = await bcrypt.hash(password, salt);

        // MAPPING the received data:
        const doc = new UserModel(
            {
                email: req.body.email,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash // we'll save here the password hash;
            }
        );
        const user = await doc.save()

        const token = jwt.sign(
            {_id: user._id },
            'secret123',
            { expiresIn: '30d'}
        );

        const {passwordHash, ...userData} = user._doc;
        // context: destructuring user._doc in 2 entities, passwordHash and userData for rest of data
        // passing just userData as response;
        res.json(
            {
                ...userData,
                token
            }
        ); // in Express there should be only ONE answer ALWAYS;
    }

    catch (err){
        console.log(err); // printing error just for the Devs;

        res.status(500).json(
            {
                message: "Registration not possible. Some error has occurred!"
            }
        );
    }

});


app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'No such user found!'
            });
        }

        const {passwordHash, ...userData} = user._doc;
        res.json(userData);
    }

    catch (err) {
        console.log(err);

        res.status(500).json({
            message:'No access!'
        });
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("SERVER OK! (was launched)");
});