import { Company } from "../models/company.model.js";
import { passwordValidator } from "../utils/passwordValidator.util.js";

// @POST
// company/register
// desc: Creating company with all level of access to the system
const registerCompany = async (req, res) => {
  const { companyName, email, password } = req.body;

  try {
    // sanitiasing inputs
    const isEmptyFields = [companyName, email, password].some(
      (field) => field?.trim() === ""
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
    const isAlreadyExistingUser = await Company.findOne({ email: email });
    if (isAlreadyExistingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    //company creation
    const company = await Company.create({ companyName, email, password });
    const createdCompany = await Company.findOne({ _id: company._id }).select(
      "-password"
    );

    if (!createdCompany) {
      return res.status(500).json({ message: "Company registration failed" });
    }

    return res.status(201).json({ message: "Company Registration Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

// @POST
// company/login
// desc: Login api of company with credentials
const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    //sanitiasing inputs
    const isEmptyFields = [email, password].some(
      (field) => field?.trim() === ""
    );
    if (isEmptyFields) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //finding company and validation
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ message: "Company doesn't exist" });
    }
    //verify password
    const isPasswordCorrect = await company.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    //generate access token
    const accessToken = await company.generateAccessToken();

    return res
      .status(200)
      .json({ message: "Company Validation Succesfull", token: accessToken });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message} ` });
  }
};
export { registerCompany, loginCompany };
