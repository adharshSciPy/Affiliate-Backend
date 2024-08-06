import jwt from "jsonwebtoken";
import { Company } from "../models/company.model.js";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { passwordValidator } from "../utils/passwordValidator.js";

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
    const isAlreadyExistingComapny = await Company.findOne({ email: email });
    const isAlreadyExistingAdmin = await Admin.findOne({ email: email });
    const isAlreadyExistingUser = await User.findOne({ email: email });
    if (
      isAlreadyExistingUser ||
      isAlreadyExistingComapny ||
      isAlreadyExistingAdmin
    ) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    //company creation
    const role = process.env.COMPANY_ROLE;
    const company = await Company.create({
      companyName,
      email,
      password,
      role,
    });
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

    //generate refresh token
    const refreshToken = await company.generateRefreshToken();

    //store refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // when going to production change boolean to true
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Company Validation Succesfull", token: accessToken });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message} ` });
  }
};

// @GET
// company/refresh
// desc:To create new access token once it has expired
const refreshCompanyAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized api request" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // find user
        const company = await Company.findOne({ _id: decoded?.id });
        if (!company) {
          return res.status(404).json({ message: "Cannot find company" });
        }

        //generate new access token
        const accessToken = await company.generateAccessToken();
        return res.status(200).json({
          message: "company validation Successful",
          token: accessToken,
        });
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
};

// @PATCH
// company/detials
// desc: Company detials api of company
const companyMoreDetials = async (req, res) => {
  const {

    phoneNumber,
    firstName,
    lastName,
    DOB,
    Gender,
    nationality,
    emailAddress,
    website,
    Address,
  } = req.body;
  const { companyId } = req.params;
  try {
    const company = await Company.findOne({ _id: companyId }).select(
      "-password"
    );
    if (!company) {
      return res.status(404).json({ message: "Company doesn't exist" });
    }
    company.firstName = firstName;
    company.lastName = lastName;
    company.DOB = DOB;
    company.Gender = Gender;
    company.nationality = nationality;
    company.emailAddress = emailAddress;
    company.phoneNumber = phoneNumber;
    company.website = website;
    company.Address = Address;
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

// @POST
// company/logout
// desc: To logout a company and clear cookies
const logoutCompany = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(204).json({ message: "Invalid Cookie" });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // Secure only in production
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
// company/companies
// desc: paginated api for getting all users with  role companies
const getAllVerifiedCompanies = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // skip logic
  const skip = (pageNumber - 1) * limitNumber;

  try {
    //pagination logic
    const role = process.env.COMPANY_ROLE;
    const totalCompanies = await Company.countDocuments({ isVerified: true });
    const totalPages = Math.ceil(totalCompanies / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    //Find companies with pagination
    const companies = await Company.find({ isVerified: true })
      .select(" companyName email phoneNumber rating isBlocked")
      .skip(skip)
      .limit(limitNumber);

    //check if companies were found
    if (companies.length === 0 || !companies) {
      return res.status(404).json({ message: "No companies found" });
    }
    //Respond with companies data and pagination info
    return res.status(200).json({
      message: "companies data found",
      data: {
        companies,
        hasNextPage,
        total: totalCompanies,
        currentPage: pageNumber,
      },
    });
  } catch (err) {
    //Handle any errors
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

// @GET
// company/companies/not-verified
// desc: paginated api for getting all users with  role companies
const getAllNewCompanies = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // skip logic
  const skip = (pageNumber - 1) * limitNumber;

  try {
    //pagination logic
    const role = process.env.COMPANY_ROLE;
    const totalCompanies = await Company.countDocuments({ isVerified: false });
    const totalPages = Math.ceil(totalCompanies / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    //Find companies with pagination
    const companies = await Company.find({ isVerified: false })
      .select(" companyName email phoneNumber rating")
      .skip(skip)
      .limit(limitNumber);

    //check if companies were found
    if (companies.length === 0 || !companies) {
      return res.status(404).json({ message: "No companies found" });
    }
    //Respond with companies data and pagination info
    return res.status(200).json({
      message: "companies data found",
      data: {
        companies,
        hasNextPage,
        total: totalCompanies,
        currentPage: pageNumber,
      },
    });
  } catch (err) {
    //Handle any errors
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

// @PATCH
// company/companies/:companyId/verify
// desc: Convert the company into verified
const verifyCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.isVerified = true;
    await company.save();

    return res.status(200).json({ message: "Company Verified Successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

// @PATCH
// company/companies/:companyId/manage-block
const manageCompanyBlock = async (req, res) => {
  const { companyId } = req.params;
  const { isBlocked } = req.body;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.isBlocked = isBlocked;
    await company.save();

    return res.status(200).json({ message: "Company Blocked Successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${err.message}` });
  }
};

// @get
// userById
// desc:find only one user data at a time
const getCompanyById = async (req, res) => {
  const { companyId } = req.params;
  try {
    const userData = await Company.findOne({ _id: companyId });

    if (!userData) {
      return res.status(404).json({ message: "Cannot find company" });
    }
    const data = {
      companyName: userData.companyName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      Address: userData.Address,
      DOB: userData.DOB,
      Gender: userData.Gender,
      emailAddress: userData.emailAddress,
      nationality: userData.nationality,
      phoneNumber: userData.phoneNumber,
      website: userData.website,
      socialLinks: userData.socialLinks,
      ExpiryDateOfID: userData.ExpiryDateOfID,
      IDNumber: userData.IDNumber
    };

    res.status(200).json({ message: "Company data found", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal server error due to ${err.message}` });
  }
};

//@GET
// company/companies/:companyId
// desc: get personal information of a company
const getPersonalInfo = async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ message: "Company not found" });
    }
    const getresult = await Company.findById(companyId);
    return res
      .status(200)
      .json({ message: "Personal data's found", data: getresult });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error due to: ${error.message}` });
  }
};

//@PATCH
//company/companies/:companyId/update-social-links
//desc : To manage social media links
const updateSocialLinks = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { socialLinks } = req.body;
    if (!Array.isArray(socialLinks)) {
      throw new Error("newLinks should be an array of social link objects");
    }

    const company = await Company.findById(companyId);
    const role = company.role;

    if (!company) {
      throw new Error("Company not found");
    }

    await company.updateSocialLinks(socialLinks);
    res.status(200).json({ message: "Social links updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//@PATCH
//company/companies/:companyId/identification
//desc: To add identification details
const identificationDetails = async (req, res) => {
  const { companyId } = req.params;
  const { IDNumber, ExpiryDateOfID } = req.body;

  try {
    const company = await Company.findOne({ _id: companyId }).select("-password");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (company.role !== parseInt(process.env.COMPANY_ROLE)) {
      return res.status(404).json({ message: "Company not found" });
    }
    company.IDNumber = IDNumber;
    company.ExpiryDateOfID = ExpiryDateOfID;
    await company.save()
    return res.status(200).json({ message: 'Identification Details Updated Successfully' })
  } catch (err) {
    return res.status(500).json({ message: `Internal server error due to: ${err.message}` });
  }
}

export {
  registerCompany,
  loginCompany,
  companyMoreDetials,
  deleteCompany,
  getAllVerifiedCompanies,
  getAllNewCompanies,
  refreshCompanyAccessToken,
  logoutCompany,
  verifyCompany,
  manageCompanyBlock,
  getPersonalInfo,
  updateSocialLinks,
  identificationDetails,
  getCompanyById
};
