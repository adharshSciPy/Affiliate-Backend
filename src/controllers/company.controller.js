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
      (field) => field?.trim() === "" || field === undefined
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

// @PATCH
// company/detials
// desc: Company detials api of company
const companyMoreDetials = async (req, res) => {
  const {
    companyName,
    phoneNumber,
    address,
    pincode,
    location,
    gstNumber,
    licenseNumber,
  } = req.body;
  const { companyId } = req.params;
  try {
    const company = await Company.findOne({ _id: companyId }).select(
      "-password"
    );
    if (!company) {
      return res.status(404).json({ message: "Company doesn't exist" });
    }
    company.companyName = companyName;
    company.phoneNumber = phoneNumber;
    company.address = address;
    company.pincode = pincode;
    company.location = location;
    company.gstNumber = gstNumber;
    company.licenseNumber = licenseNumber;

    await company.save();

    return res.status(200).json({
      message: "Company detials updated successfully",
      data: company,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message} ` });
  }
};

// @DELETE
// company detials/delete
// desc: Company detials delete api of company
const deleteCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const isCompanyExist = await Company.findOne({ _id: companyId });
    if (!isCompanyExist) {
      return res.status(404).json({ message: "Company doesn't exist" });
    }
    const company = await Company.deleteOne({ _id: companyId });
    if (!company) {
      return res.status(404).json({ message: "Company deletion failed" });
    }
    return res.status(200).json({
      message: "Company detials deleted successfully",
      data: company,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message} ` });
  }
};

// @GET
// user/companies
// desc: paginated api for getting all users with  role companies
const getAllcompanies = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // skip logic
  const skip = (pageNumber - 1) * limitNumber;

  try {
    //pagination logic
    const totalCompanies = await Company.countDocuments({ role: "company" });
    const totalPages = Math.ceil(totalCompanies / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    //Find companies with pagination
    const companies = await Company.find({ role: "company" })
      .select(" companyName email phoneNumber rating")
      .skip(skip)
      .limit(limitNumber);

    //check if companies were found
    if (companies.length === 0) {
      return res.status(404).json({ message: "No companies found" });
    }
    //Respond with companies data and pagination ifo
    return res.status(200).json({
      message: "companies data found",
      data: { companies, hasNextPage, totalPages, currentPage: pageNumber },
    });
  } catch (err) {
    //Handle any errors
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

export {
  registerCompany,
  loginCompany,
  companyMoreDetials,
  deleteCompany,
  getAllcompanies,
};
