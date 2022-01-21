require('dotenv').config()
const mongoose = require("mongoose")
const User = require('./User')
const { Schema, model } = mongoose

const PostSchema = new Schema({
    content: {
        type: String,
        required: [true, 'You must add some content.'],
        maxLength: [100000, 'Your todo item cannot be longer than 100000 characters.'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'You must add a title.'],
        maxLength: [140, 'Title can not be longer than 140 characters.']
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User must be provided']
    }
}, {
    timestamps: true
})

PostSchema.pre('remove', async function (next) {
    await this.model('Comment').deleteMany({ post: this._id})
    next()
})

PostSchema.methods.getLikers = async function () {
    const likers = await User.find({ likes: { "$in": this._id } }).select('name _id')
    return likers
}

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
})

const Post = model('Post', PostSchema)

module.exports = Post