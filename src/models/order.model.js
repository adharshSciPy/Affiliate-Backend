import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    serviceIds: {
      type: [Schema.Types.ObjectId],
      ref: "Service",
      required: [true, "Service Id is required"],
    },
    grandTotal: {
      type: Number,
      required: [true, "Grand Total is required"],
    },
    tax: {
      type: Number,
      required: [true, "Tax is required"],
    },
    paymentMode: {
      type: String,
      required: [true, "Payment Mode is required"],
    },
    status: {
      type: String,
    },
    isCancelled: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
