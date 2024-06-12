import mongoose, { Schema } from "mongoose";

const payoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company"
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
