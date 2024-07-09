import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const defaultRole = process.env.CUSTOMER_ROLE
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    role: {
        type: Number,
        default: defaultRole
    },
    officialId: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, "User's Email number is required"]
    },
    phoneNumber: {
        type: Number,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    socialLinks: {
        type: [''],
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true })

// hashing admin password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10)
        next();
    }
    catch (err) {
        return next(err);
    }
})

// generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
        // {
        //     expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        // }
    );
}

// generate refresh token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
        // {
        //     expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        // }
    );
}

// matching admin password
userSchema.methods.isPasswordCorrect = async function (password) {
    if (password) {
        return await bcrypt.compare(password, this.password)
    }
    next()
}

export const User = mongoose.model("User", userSchema)