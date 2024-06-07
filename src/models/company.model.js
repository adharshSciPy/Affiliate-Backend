import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
    },
    role: {
      type: String,
      trim: true,
      default: "company",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Admin's Email number is required"],
    },
    phoneNumber: {
      type: Number,
      trim: true,
      required: [true, "Admin's Phonenumber is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    pincode: {
      type: Number,
      trim: true,
      required: [true, "Pincode is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    gstNumber: {
      type: String,
      required: [true, "GSTIN Number is required"],
    },
    licenseNumber: {
      type: String,
      required: [true, "License Number is required"],
    },
    rating: {
      type: Number,
    },
  },
  { timestamps: true }
);

// hashing company password
companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    return next(err);
  }
});

// generate access token
companySchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      companyName: this.companyName,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// matching company password
companySchema.methods.isPasswordCorrect = async function (password) {
  if (password) {
    return await bcrypt.compare(password, this.password);
  }
  next();
};

export const Company = mongoose.model("Company", companySchema);