import mongoose, { Schema } from "mongoose";

const payoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company id is required"],
    },
    amount: {
      type: Number,
      trim: true,
      required: [true, "Amount is required"],
    },
    paymentMode: {
      type: String,
      required: [true, "Payment mode is required"],
    },
    status: {
      type: Boolean,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: [true, "Admin id is required"],
    },
  },
  { timestamps: true }
);

export const Payout = mongoose.model("Payout", payoutSchema);
