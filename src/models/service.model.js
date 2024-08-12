import mongoose, { Schema } from 'mongoose';

const serviceSchema = new Schema({
    category: {
        type: String,
    },
    image: {
        type: [String],
    },
    title: {
        type: String,
        required: [true, 'First Name is required']
    },
    courseDescription: {
        type: String,
    },
    duration: {
        type: String,
        required: [true, 'duration is required']
    },
    certificate: {
        type: String,
        required: [true, 'certificate is required']
    },
    courseFee: {
        type: String,
        required: [true, 'courseFee is required']
    },
    offerFee: {
        type: String,
        required: [true, 'price is required']
    },
    addHeading: {
        type: String,
    },
    description: {
        type: String,
    },
    tags: {
        type: [String]
    },
    mode: {
        type: String
    },
    ratings: {
        type: String
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'companyId is required']
    }
},
    { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema)