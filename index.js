import express from 'express';
import mongoose from 'mongoose';
import {registerValidator, loginValidator, postCreateValidator} from './validators/validators.js';
import checkAuth from "./utils/checkAuth.js";
import {UserController, PostController} from './controllers/index.js'
import multer from 'multer';
import handleValidationErrors from "./utils/handleValidationErrors.js";
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


const app = express(); // CREATING an app, aka server;
app.use(express.json()); // SET-UP: indicating that our app can READ now json files;
app.use('/uploads', express.static('uploads')); // instructing express that we might make requests in upload for static files

// CREATING a multer storage:
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
       cb(null, 'uploads')
    },
    fileName: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage}); // making a function to USE multer; MIDDLEWARE

app.get('/', (req, res) => {
    // RECEIVES a get request on homepage and returns a body with "Hello World";
    res.send("HELLO WORLD,. this is some new shit!");
});

// USER APIs:
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// POSTS APIs:
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getPost);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);

// UPLOAD API
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("SERVER OK! (was launched)");
});