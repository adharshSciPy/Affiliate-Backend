import mongoose, { Schema } from 'mongoose'
import { generateToken } from '../utils/uniqueToken.js';

const tokenSchema = new Schema({
    token: {
        type: String,
    },
    useCount: {
        type: Number,
        required: [true, 'totalUsage is required']
    },
    usageTimes: {
        type: Number
    },
    discount: {
        type: Number,
        required: [true, 'Discount is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required']
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: [true, 'Admin Id is required']
    }
}, { timestamps: true })

// is token's usage times exced or not
tokenSchema.methods.isTokenUsageExceeded = function (usageTimes) {
    return usageTimes < this.useCount;
};

// generate unique token and save it in the database
tokenSchema.methods.generateAndSaveUniqueToken = async function (firstName, lastName) {
    let token = generateToken(firstName, lastName);

    let existingToken = await mongoose.model('Token').findOne({ token });
    while (existingToken) {
        token = generateToken(firstName, lastName);
        existingToken = await mongoose.model('Token').findOne({ token });
    }

    this.token = token;
    await this.save();
    return token;
};

export const Token = mongoose.model('Token', tokenSchema)