import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidator} from './validators/auth.js';
import {validationResult} from "express-validator";
import UserModel from './models/User.js';

// database details:
const dbname = "my_first_database";
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

app.post('/auth/login', (req, res) => {

    // if (req.body === 'test@test.ru') {
    //     const token = jwt.sign(
    //         {
    //             email: req.body.email,
    //             fullName: "Vasia Pupkin",
    //         },
    //         'secret123'
    //     );
    // }
    //



    // RECEIVES a post request and RETURNS a JSON file:
    res.json(
        {
            success: true,
            token
        },
    );

});

app.post('/auth/register', registerValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // salt - is the encryption algorithm;
    const passwordHash = await bcrypt.hash(password, salt )

    const doc = new UserModel(
        {
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            password: req.body.password,
        }
    );

    res.json(
        // returns a JSON that tells us info about validation; if all good returns "success: true"
        { success: true }
    )

});


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("SERVER OK! (was launched)");
});