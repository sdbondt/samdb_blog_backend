const User = require('../models/User')
const CustomError = require('../errorhandlers/CustomError')
const { StatusCodes } = require('http-status-codes')
const asyncHandler = require('../errorhandlers/asyncHandler')

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError('Please provide an email and password.', StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({ email })
    
    if (!user) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    }

    const isMatch = await user.comparePassword(password)
    
    if (!isMatch) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    } else {
        const token = user.getJWT()
        res.status(StatusCodes.OK).json({ user: { name: user.name, id: user.id }, token })
    }
})

exports.signup = asyncHandler(async (req, res) => {
    
    const { password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        throw new CustomError('Passwords should match.', StatusCodes.BAD_REQUEST)
    }
    const user = await User.create({...req.body})
    const token = user.getJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, id: user.id}, token })
})

exports.getProfile = asyncHandler(async (req, res) => {
    await req.user.populate('posts comments')
    const comments = req.user.comments
    const posts = req.user.posts
    res.status(StatusCodes.OK).json({ user: req.user, comments, posts })
})