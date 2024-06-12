import { Admin } from "../models/admin.model.js"
import { passwordValidator } from "../utils/passwordValidator.util.js"

// @POST
// admin/register
// desc: Creating admin with all level of access to the system
const registerAdmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    try {
        // sanitiasing inputs
        const isEmptyFields = [firstName, lastName, email, password].some((field) => field?.trim() === "")
        if (isEmptyFields) {
            return res.status(401).json({ message: "All fields are required", })
        }

        //validate password
        const isValidPassword = passwordValidator(password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number", })
        }

        //prevent duplicate accounts
        const isAlreadyExistingUser = await Admin.findOne({ email: email });
        if (isAlreadyExistingUser) {
            return res.status(409).json({ message: 'Email is already in use' });
        }

        //admin creation
        const admin = await Admin.create({ firstName, lastName, email, password });
        const createdAdmin = await Admin.findOne({ _id: admin._id }).select('-password');

        if (!createdAdmin) {
            return res.status(500).json({ message: 'Admin registration failed' });
        }

        return res.status(201).json({ message: 'Admin Registration Successful' });

    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

// @POST
// admin/login
// desc: Login api of admin with credentials
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // sanitiasing inputs
        const isEmptyFields = [email, password].some((field) => field?.trim() === "");
        if (isEmptyFields) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //finding admin and validating
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin doesn't exist" });
        }

        // verify password 
        const isPasswordCorrect = await admin.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        //generate access token
        const accessToken = await admin.generateAccessToken();

        return res.status(200).json({ message: 'Admin Validation Succesfull', token: accessToken })
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
};

export { registerAdmin, loginAdmin }