const asyncHandler = require("../errorhandlers/asyncHandler")
const CustomError = require('../errorhandlers/CustomError')
const Post = require("../models/Post")
const { StatusCodes } = require("http-status-codes")


exports.createPost = asyncHandler(async (req, res) => {
    req.body.creator = req.user._id
    const post = await Post.create(req.body)
    res.status(StatusCodes.CREATED).json({ post })
})

exports.getPost = asyncHandler(async (req, res) => {
    const { id } = req.params
    
    const post = await Post.findById(id).populate('comments')
    if (!post) {
        throw new CustomError("No post found.", StatusCodes.NOT_FOUND)
    } else {
        res.status(StatusCodes.OK).json({ post, comments: post.comments })
    }
})

exports.getPosts = asyncHandler(async (req, res) => {
    const queryObj = {}
    let { content, title, page, limit, direction } = req.query
    direction = direction === 'asc' ? '': '-'
    if (content) {
        queryObj.content = { $regex: content, $options: "i" }
    }
    if (title) {
        queryObj.title = { $regex: title, $options: "i" }
    }
    let queryString = Post.find(queryObj).sort(`${direction}createdAt`)

    const pageNum = Number(page) || 1;
    const pageLimit = Number(limit) || 10;
    const skip = (pageNum - 1) * pageLimit;

    queryString = queryString.skip(skip).limit(pageLimit)

    const posts = await queryString
    res.status(StatusCodes.OK).json({ posts })
})

exports.updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { content, title } = req.body
    if (!content && !title) {
        throw new CustomError('Not updating correctly', StatusCodes.BAD_REQUEST)
    }

    const post = await Post.findOneAndUpdate({ _id: id, creator: req.user._id }, req.body, { new: true, runValidators: true })
    if (!post) {
        throw new CustomError('Not updating correctly', StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ post })
})

exports.deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const post = await Post.findOneAndRemove({ id, creator: req.user._id })
    if (!post) {
        throw new CustomError("No post found.", StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ post, message: "Deleted post." })
})

exports.likePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
        throw new CustomError('NO such post exists.', StatusCodes.BAD_REQUEST)
    }
    if (req.user.likes.includes(id)) {
        throw new CustomError("User has already like this post.", StatusCodes.BAD_REQUEST)
    }
    req.user.likes.push(id)
    const user = await req.user.save()
    res.status(StatusCodes.OK).json({ user })
})

exports.unlikePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
        throw new CustomError('No such post exists.', StatusCodes.BAD_REQUEST)
    }
    if (!req.user.likes.includes(id)) {
        console.log('doesnt')
        throw new CustomError("User has not liked this post.", StatusCodes.BAD_REQUEST)
    }
    req.user.likes = req.user.likes.filter(p => {
        return p._id.toString() !== post._id.toString()
    })
    const user = await req.user.save()
    res.status(StatusCodes.OK).json({ user })
})

exports.getLikesByPost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
        throw new CustomError('No such post exists.', StatusCodes.BAD_REQUEST)
    }
    const likers = await post.getLikers()
    res.status(StatusCodes.OK).json({ likers, count: likers.length })
})

