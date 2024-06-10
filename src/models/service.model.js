import mongoose, { Schema } from 'mongoose'

const serviceSchema = new Schema({
    title: {
        type: String,
        required: [true, 'First Name is required']
    },
})

export const Service = mongoose.model("Service", serviceSchema)