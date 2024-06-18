import mongoose, { Schema } from "mongoose";
 
const transactionSchema = new Schema({
  transactionId: {
    type: String,
    required: [true, "transactionId is required "],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "userId is required"],
},
orderId:{
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, "orderId is required"],
},
grandTotal:{
    type:Number,
    required: [true, "GrandTotal is required"],
},
tax:{
    type:Number,
    required: [true, "Tax is required"],
},
paymentMode:{
    type:String,
    required: [true, "PaymentMode is required"],   
},
status:{
    type:String,
},
isError:{
    type:Boolean,
},
errorMessage:{
    type:String,
} 
},
{timestamps:true}
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
