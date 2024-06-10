import { Company } from "../models/company.model";
import { passwordValidator } from "../utils/passwordValidator.util";

// @POST
// company/register
// desc: Creating super company with all level of access to the system
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
      return res
        .status(401)
        .json({
          message:
            "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number",
        });
    }

    //prevent duplicate accounts
    const isAlreadyExistingUser = await Company.findOne({ email: email });
    if (isAlreadyExistingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    //admin creation
    const company = await Company.create({ companyName, email, password });
    const createdCompany = await Company.findOne({ _id: company._id }).select(
      "-password"
    );

    if (!createdCompany) {
      return res.status(500).json({ message: "Company registration failed" });
    }

    return res.status(201).json({ message: "Company Registration Successful" });
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};
export { registerCompany };
