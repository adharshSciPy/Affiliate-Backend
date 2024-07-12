import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Admin } from "../models/admin.model.js";


import jwt from "jsonwebtoken";
import { passwordValidator } from "../utils/passwordValidator.js";

// @POST
// user/register
// desc: Api for creating new admins
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // sanitiasing inputs
    const isEmptyFields = [firstName, lastName, email, password, role].some(
      (field) => field === "" || field === undefined
    );
    if (isEmptyFields) {
      return res.status(401).json({ message: "All fields are required" });
    }

    //validate password
    const isValidPassword = passwordValidator(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message:
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number",
      });
    }

    //prevent duplicate accounts
    const isAlreadyExistingCompany = await Company.findOne({ email: email });
    const isAlreadyExistingAdmin = await Admin.findOne({ email: email });
    const isAlreadyExistingUser = await User.findOne({ email: email });
    if (
      isAlreadyExistingUser ||
      isAlreadyExistingCompany ||
      isAlreadyExistingAdmin
    ) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    //user creation
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    const createdUser = await User.findOne({ _id: user._id }).select(
      "-password"
    );

    if (!createdUser) {
      return res.status(500).json({ message: "User registration failed" });
    }

    return res.status(201).json({ message: "User Registration Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

// @POST
// user/login
// desc:Login api of admin with credentials
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sanitize and validate input
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user
    const models = [User, Admin, Company];
    let user = null;

    for (const model of models) {
      user = await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ message: "Email doesn't exist" });
    }

    // Verify password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Validation Successful", token: accessToken });
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error due to ${err.message}` });
  }
};

// @GET
// user/refresh
// desc: To create new access token once it has expired (for all user roles -> Admin, Company and User)
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized API request" });
  }

  try {
    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ message: "Refresh token expired. Please log in again." });
        }
        return res.status(403).json({ message: "Forbidden. Invalid token." });
      }

      let user;
      const role = Number(decoded.role)

      // Retrieve user based on role from decoded token
      if (!role) {
        return res.status(403).json({ message: "Forbidden. Invalid user role." });
      }

      const adminRole = Number(process.env.ADMIN_ROLE);
      const customerRole = Number(process.env.CUSTOMER_ROLE);
      const affiliaterRole = Number(process.env.AFFILIATER_ROLE);
      const companyRole = Number(process.env.COMPANY_ROLE);

      switch (role) {
        case adminRole:
          user = await Admin.findOne({ _id: decoded.id });
          break;
        case customerRole:
          user = await User.findOne({ _id: decoded.id });
          break;
        case affiliaterRole:
          user = await User.findOne({ _id: decoded.id });
          break;
        case companyRole:
          user = await Company.findOne({ _id: decoded.id });
          break;
        default:
          return res.status(404).json({ message: "Invalid role" });
      }

      if (!user) {
        return res.status(404).json({ message: "Cannot find user" });
      }

      // Generate new access token
      const accessToken = await user.generateAccessToken();

      // Respond with success message and new access token
      return res.status(200).json({ message: "User validation successful", data: accessToken });
    });

  } catch (err) {
    return res.status(500).json({ message: `Internal server error due to ${err.message}` });
  }

};

// @get
// userById
// desc:find only one user data at a time
const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const userData = await User.findOne({ _id: userId });

    if (!userData) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    const data = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      officialId: userData.officialId,
      phoneNumber: userData.phoneNumber,
      socialLinks: userData.socialLinks

    };

    res.status(200).json({ message: "User data found", data });
  } catch (err) {
    return res.status(500).json({ message: `Internal server error due to ${err.message}` });
  }
}

// @POST
// user/logout
// desc: To logout a user and clear cookies
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(204).json({ message: "Invalid Cookie" });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // Secure only in production
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error during logout:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

// @GET
// user/customers
// desc: Paginated api for getting all users with role customer
const getAllCustomers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // skip logic
  const skip = (pageNumber - 1) * limitNumber;

  try {
    // pagination logic
    const role = process.env.CUSTOMER_ROLE;
    const totalCustomers = await User.countDocuments({ role });
    const totalPages = Math.ceil(totalCustomers / limitNumber);
    const hasNextPage = pageNumber < totalPages;

    // Find customers with pagination
    const customers = await User.find({ role })
      .select("firstName lastName email phone")
      .skip(skip)
      .limit(limitNumber);

    // Check if customers were found
    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    // Respond with customer data and pagination info
    return res.status(200).json({
      message: "Customer data found",
      data: { customers, hasNextPage, totalPages, currentPage: pageNumber },
    });
  } catch (err) {
    // Handle any errors
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

// @GET
// user/affilitaers
// desc: paginated api for getting all users with role affiliaters
const getAllVerifiedAffiliaters = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  try {
    const role = parseInt(process.env.AFFILIATER_ROLE);
    const totalAffiliaters = await User.countDocuments({ role, isVerified: true });
    const totalPages = Math.ceil(totalAffiliaters / limitNumber);
    const hasNextPage = pageNumber < totalPages;

    const affiliaters = await User.aggregate([
      {
        $match: {
          role: role,
          isVerified: true
        }
      },
      {
        $lookup: {
          from: 'tokens', 
          localField: '_id', 
          foreignField: 'userId',  
          as: 'tokens' 
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          tokens: {
            token: 1,
            _id: 1,
          }
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limitNumber
      }
    ])

    if (affiliaters.length === 0) {
      return res.status(404).json({ message: "No affiliaters found" });
    }

    return res.status(200).json({
      message: "Affiliaters data found",
      data: { affiliaters, hasNextPage, totalPages, currentPage: pageNumber },
    });
  } catch (err) {
    return res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};


// @GET
// user/affiliaters/not-verified
// desc: paginated api for getting all users with role affiliaters
const getAllNonVerifiedAffiliaters = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  try {
    const role = process.env.AFFILIATER_ROLE;
    const totalAffiliaters = await User.countDocuments({ role, isVerified: false });
    const totalPages = Math.ceil(totalAffiliaters / limitNumber);
    const hasNextPage = pageNumber < totalPages;

    const affiliaters = await User.find({ role, isVerified: false })
      .select("firstName lastName email phone")
      .skip(skip)
      .limit(limitNumber);

    if (affiliaters.length === 0) {
      return res.status(404).json({ message: "No non-verified affiliaters found" });
    }

    return res.status(200).json({
      message: "Non-verified affiliaters data found",
      data: { affiliaters, hasNextPage, totalPages, currentPage: pageNumber },
    });
  } catch (err) {
    return res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};


// @PATCH
// user/affiliaters/:affiliaterId/verify
// desc: to verify an affiliater
const verifyAffiliater = async (req, res) => {
  const { affiliaterId } = req.params;

  try {
    const verifyAffiliater = await User.findById(affiliaterId);
    if (!verifyAffiliater) {
      return res.status(404).json({ message: "Affiliater not found" })
    }

    if (verifyAffiliater.role !== (parseInt(process.env.AFFILIATER_ROLE))) {
      return res.status(400).json({ message: "Unauthorized User" })
    }

    if (verifyAffiliater.role === (parseInt(process.env.AFFILIATER_ROLE))) {
      const affiliaterVerified = await User.findByIdAndUpdate(
        affiliaterId,
        { isVerified: true },
        { new: true }
      );
      return res.status(200).json({ message: "Affiliater Verified Successfully" })
    }
  } catch (error) {
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}

// @PATCH
// user/users/:userId/manage-block
// desc: To manage block of all users
const manageUsersBlock = async (req, res) => {
  const { userId } = req.params;
  const { isBlocked } = req.body;
  try {
    const allUser = await User.findById(userId)
    if (!allUser) {
      return res.status(404).json({ message: "User not found" })
    }

    allUser.isBlocked = isBlocked;
    await allUser.save();
    return res.status(200).json({ message: "Blocked Sucessfully" })
  } catch (error) {
    return res.status(500).json({ message: `Internal server error due to: ${error.message}` });
  }
}

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getAllCustomers,
  getAllVerifiedAffiliaters,
  getAllNonVerifiedAffiliaters,
  verifyAffiliater,
  manageUsersBlock,
  getUserById
};
