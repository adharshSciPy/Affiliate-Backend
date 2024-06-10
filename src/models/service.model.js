import mongoose, { Schema } from 'mongoose';


const serviceSchema = new Schema({
    title: {
        type: String,
        required: [true, 'First Name is required']
    },
    description:{
        type:String,
    },
    duration:{
        type:String,
        required: [true, 'duration is required']
    },
    price:{
        type:Number,
        required: [true, 'price is required']

    },
    discount:{
        type:Number,
        required: [true, 'discount is required']
    },
    category:{
        type:String,
    },
    tags:{
        type:[String],
        required: [true, 'tags is required']
    },
    mode:{
        type:String,
    },
    images:{
        type:[String],
    },
    ratings:{
        type:String,
    },
    CompanyId:{
        type:String,
        required: [true, 'companyId is required']
    }    
},
{timestamps:true}
);


export const Service = mongoose.model("Service", serviceSchema)