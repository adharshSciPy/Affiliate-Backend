import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
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

    //admin creation
    const role = process.env.ADMIN_ROLE;
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
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

export { registerAdmin  };
