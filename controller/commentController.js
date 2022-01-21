const asyncHandler = require("../errorhandlers/asyncHandler")
const CustomError = require("../errorhandlers/CustomError")
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const { StatusCodes } = require("http-status-codes")

exports.getComments = asyncHandler(async (req, res) => {
    const { id } = req.params
    const comments = await Comment.find({ post: id })
    res.status(StatusCodes.OK).json({ comments })
})

exports.createComment = asyncHandler(async (req, res) => {
    const { id } = req.params
    req.body.creator = req.user.id
    req.body.post = id
    const { content } = req.body
    if (!content) {
        throw new CustomError('Your comment must have some content'. StatusCodes.BAD_REQUEST)
    }
    const post = await Post.findById(id)
    if (!post) {
        throw new CustomError('No such post exists.', StatusCodes.BAD_REQUEST)
    }
    const comment = await Comment.create(req.body)
    res.status(StatusCodes.CREATED).json({ comment })
})

exports.updateComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params
    const { content } = req.body
    if (!content) {
        throw new CustomError('Your comment must have some content'. StatusCodes.BAD_REQUEST)
    }
    const comment = await Comment.findOneAndUpdate({ id: commentId, creator: req.user.id, post: id }, req.body, { runValidators: true, new: true })
    if (!comment) {
        throw new CustomError('No such comment exists.', StatusCodes.BAD_REQUEST)
    }
    res.status(StatusCodes.CREATED).json({ comment })
})

exports.deleteComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params
    const comment = await Comment.findOneAndRemove({ id: commentId, creator: req.user.id, post: id})
    if (!comment) {
        throw new CustomError('No such comment exists.', StatusCodes.BAD_REQUEST)
    }
    res.status(StatusCodes.OK).json({ comment })
})

