const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            maxLength: [30, 'Your name cannot exceed 30 characters']
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true,
            validate: [validator.isEmail, 'Please enter valid email address']
        },
        password: {
            type: String,
            required: [true, 'Please enter your password'],
            minlength: [6, 'Your password must be longer than 6 characters'],
            select: false
        },
        avatar: {
            type : String ,
            required : false
        },
        pfe : {
            type : mongoose.Schema.ObjectId,
            ref : 'Pfe',
            required : false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            default: 'student'
        },
        supervisor : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : false
        },
        demands : [
            {
                student : {
                    type : mongoose.Schema.ObjectId,
                    ref : 'User' ,
                    required : false
                },
                pfe : {
                    type : mongoose.Schema.ObjectId,
                    ref : 'Pfe'
                }
            }
        ],
        supervisedPfe : [
            {
                student : {
                    type : mongoose.Schema.ObjectId,
                    ref : 'User' ,
                    required : false
                },
                pfe : {
                    type : mongoose.Schema.ObjectId,
                    ref : 'Pfe'
                }
            }
        ],
        resetPasswordToken: String,
        resetPasswordExpire: Date

    }
)

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Encrypting password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})



// Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model('User' , userSchema)