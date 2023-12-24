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

        // creating a comments section for a post:
        comments: [
            {
                user: {
                    fullName: {
                        type: String,
                        required: true
                    },
                    avatarUrl: {
                        type: String,
                        default: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg/v1/fill/w_300,h_300,q_75,strp/default_user_icon_4_by_karmaanddestiny_de7834s-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzAwIiwicGF0aCI6IlwvZlwvMjcxZGVlYTgtZTI4Yy00MWEzLWFhZjUtMjkxM2Y1ZjQ4YmU2XC9kZTc4MzRzLTY1MTViZDQwLThiMmMtNGRjNi1hODQzLTVhYzFhOTVhOGI1NS5qcGciLCJ3aWR0aCI6Ijw9MzAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.W7L0Rf_YqFzX9yxDfKtIMFnnRFdjwCHxi7xeIISAHNM"
                    },
                },
                text: String
            }
        ],


        imageUrl: String
    },

    {
        timestamps: true
    }
);

export default mongoose.model("Post", PostSchema);