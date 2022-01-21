require('dotenv').config()
const mongoose = require("mongoose")
const { Schema, model } = mongoose

const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'You must add some content.'],
        maxLength: [1000, 'Your comment cannot be longer than 1000 characters.'],
        trim: true
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'You must add a creator to your comment.']
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'Comments must be linked to a post.']
    }
}, { timestamps: true})

const Comment = model('Comment', CommentSchema)
module.exports = Comment