const User = require('../models/user');

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies
    console.log('-----------req.cookies-------------');
    console.log(token);
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    } 

    /* const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error("Not Logged");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1]; */
    //const token = localStorage.getItem('token')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
})

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}