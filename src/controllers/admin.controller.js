import jwt from 'jsonwebtoken'
import { Admin } from "../models/admin.model.js";
import { passwordValidator } from "../utils/passwordValidator.js";

// @POST
// admin/register
// desc: Creating admin with all level of access to the system
const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // sanitiasing inputs
    const isEmptyFields = [firstName, lastName, email, password].some(
      (field) => field?.trim() === "" || field === undefined
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
    const isAlreadyExistingUser = await Admin.findOne({ email: email });
    if (isAlreadyExistingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    //admin creation
    const admin = await Admin.create({ firstName, lastName, email, password });
    const createdAdmin = await Admin.findOne({ _id: admin._id }).select(
      "-password"
    );

    if (!createdAdmin) {
      return res.status(500).json({ message: "Admin registration failed" });
    }

    return res.status(201).json({ message: "Admin Registration Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

// @POST
// admin/login
// desc: Login api of admin with credentials
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // sanitiasing inputs
    const isEmptyFields = [email, password].some(
      (field) => field?.trim() === "" || field === undefined
    );
    if (isEmptyFields) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //finding admin and validating
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin doesn't exist" });
    }

    // verify password
    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    //generate access token
    const accessToken = await admin.generateAccessToken();

    //generate refresh token
    const refreshToken = await admin.generateRefreshToken();

    //store refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // when going to production change boolean to true
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Admin Validation Succesfull", token: accessToken });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

// @GET
// admin/refresh
// desc:To create new access token once it has expired
const refreshAdminAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      return res.status(402).json({ message: "'Unauthorized api request" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // find admin
        const admin = await Admin.findOne({ _id: decoded?.id });
        if (!admin) {
          return res.status(404).json({ message: "Cannot find admin" });
        }

        //generate new access token
        const accessToken = await admin.generateAccessToken();
        return res
          .status(200)
          .json({ message: "Admin validation Successful", token: accessToken });
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

// @POST
// user/logout
// desc: To logout a user and clear cookies
const logoutAdmin = async (req, res) => {
    try {
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        return res.status(204).json({ message: "Invalid Cookie" });
      }
  
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,  // Secure only in production
        sameSite: 'None',
      });
  
      return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  };

export { registerAdmin, loginAdmin,refreshAdminAccessToken,logoutAdmin };
