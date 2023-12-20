import PostModel from '../models/Post.js'

export const create = async (req, res) => {
    try {
        const doc = new PostModel(
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                // viewsCount: req.body.viewsCount,
                user: req.userId,
            }
        );

        const post = await doc.save();

        // HAPPY PATH: returning the post doc that was created in DB
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Was not able to create a post!"
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Was not able to return posts!"
        });
    }
}

export const getPost = async (req, res) => {

    try {
        const postId = req.params.id; // we get the id directly from the URL

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId  // find an element by ID;
            },
            {
                $inc: {viewsCount: 1}  // when found increment its viewsCount with one (stupid syntax, I know);
            },
            {
                returnDocument: 'after' // return the UPDATED document
            },
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: "This post was not found!"
            });
        }

        res.json(doc);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Was not able to return posts!"
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id; // we get the id directly from the URL

        const doc = await PostModel.findOneAndDelete(
            {
                _id: postId // find an element by ID;
            },
            {
                returnDocument: 'after' // return the UPDATED document;
            }
        );

        if (!doc) {
            res.status(404).json({
                message: "No such post found for deletion!"
            });
        }

        res.json({
            'message': "POST: " + postId + " successfully deleted"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Was not able to DELETE post!"
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId // find an element by ID;
            },
            {   // HERE we indicated WHAT we're trying to update:
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.user,
                tags: req.body.tags,
            },

            {
                returnDocument: 'after' // return the UPDATED document;
            }
        );

        if (!doc) {
            res.status(404).json({
                message: "No such post found for being updated!"
            });
        }

        res.json({'success': true});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Was not able to EDIT this post!"
        });
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(obj => obj.tags)
            .flat().slice(0, 5);

        res.json(tags);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Was not able to return tags!"
        });
    }
}