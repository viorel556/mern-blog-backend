import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true,
            unique: true
        },

        tags: {
            type: Array,
            default: [] // if tags are not provided, an empty array is saved in DB;
        },

        viewsCount: { // this one will count the number of views we get per post;
            type: Number,
            default: 0
        },

        user: {
            type: mongoose.Schema.Types.ObjectId, // indicating that this is a specific mongoDB type of object;
            ref: 'User',  // establishing a LINK between 2 tables;
            required: true,
        },

        imageUrl: String
    },

    {
        timestamps: true
    }
);

export default mongoose.model("Post", PostSchema);