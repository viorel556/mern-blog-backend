import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {
    registerValidator,
    loginValidator,
    postCreateValidator,
} from './validators/validators.js';
import checkAuth from "./utils/checkAuth.js";
import {UserController, PostController} from './controllers/index.js'
import multer from 'multer';
import handleValidationErrors from "./utils/handleValidationErrors.js";

const dbname = "blog";
const user = 'viorel556';
const password = 'standart1';
const cluster = 'cluster0';
const finalUrl = `mongodb+srv://${user}:${password}@${cluster}.xx2rtno.mongodb.net/${dbname}?retryWrites=true&w=majority`

 // DATABASE SETUP:
// Connecting to MongoDB by using Mongoose:
mongoose
    .connect(finalUrl) // IMPORTANT: HEROKU deploys our user credentials for access;
    .then(() => console.log('DB is OK! '))
    .catch((err) => console.log('DB ERROR: ', err))

// CREATING an app, aka server:
const app = express();

app.use(express.json()); // SET-UP: indicating that our app can READ now json files;
app.use(cors());
app.use('/uploads', express.static('uploads')); // instructing express that we might make requests in upload for static files

// CREATING a multer storage (local storage within our server):
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage}); // making a function to USE multer; MIDDLEWARE;

app.get('/', (req, res) => {
    // RECEIVES a get request on homepage and returns a body with "Hello World";
    res.send("THIS SERVER IS RUNNING BABE!!");
});

// USER APIs:
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// POSTS APIs:
// Get all posts:
app.get('/posts', PostController.getAll);
// get tags:
app.get('/tags', PostController.getLastTags);
// get tags last tags:
app.get('/posts/tags', PostController.getLastTags);
// get a specific post:
app.get('/posts/:id', PostController.getPost);
// create a new post:
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
// delete a certain post:
app.delete('/posts/:id', checkAuth, PostController.remove);
// edit a certain post;
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);
// upload a picture that is saved in "uploads" folder:
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        response: "IMAGE SUCCESSFULLY UPLOADED: ",
        url: `/uploads/${req.file.originalname}`
    });
});

// adding a comment (updating the post);
app.patch('/posts/:id/comments', checkAuth,  handleValidationErrors, PostController.addComment);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) { return console.log(err); }
    console.log("SERVER OK! (was launched)");
});