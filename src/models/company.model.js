import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const defaultRole = process.env.COMPANY_ROLE

const socialSchema = new Schema({
  youtube: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  facebook: {
    type: String,
    trim: true,
  },
  twitter: {
    type: String,
    trim: true,
  },
});

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
    },
    role: {
      type: Number,
      default: defaultRole
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

    },
    address: {
      type: String,

    },
    pincode: {
      type: Number,
      trim: true,

    },
    location: {
      type: String,

    },
    gstNumber: {
      type: String,

    },
    licenseNumber: {
      type: String,

    },
    rating: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    DOB: {
      type: String,
      required: [true, "Date of Birth is required"]
    },
    Gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
    },
    emailAddress: {
      type: String,
      required: [true, "Personal Email is required"],
      unique: true,
    },
    website: {
      type: String,
      required: [true, "Website is required"],
    },
    Address: {
      type: String,
      required: [true, "Address is required"],
    },
    IDNumber: {
      type: String
    },
    ExpiryDateOfID: {
      type: String
    },
    registerNumber: {
      type: String
    },
    companyAddress: {
      type: String
    },
    businessNature: {
      type: String
    },
    listOfOwners: {
      type: String
    },
    IFSC: {
      type: String
    },
    accountNumber: {
      type: String
    },
    UPINumber: {
      type: String
    },
    socialLinks: [socialSchema],
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
      isVerified: this.isVerified,
      isBlocked: this.isBlocked
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// generate refresh token
companySchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      isVerified: this.isVerified,
      isBlocked: this.isBlocked
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
}

// matching company password
companySchema.methods.isPasswordCorrect = async function (password) {
  if (password) {
    return await bcrypt.compare(password, this.password);
  }
  next();
};

// Add a method to update social links
companySchema.methods.updateSocialLinks = async function (newLinks) {
  this.socialLinks = newLinks;
  return await this.save();
};

export const Company = mongoose.model("Company", companySchema);
