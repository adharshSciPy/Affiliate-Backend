import { Admin } from "../models/admin.model"
import { passwordValidator } from "../utils/passwordValidator.util"

// @POST
// admin/register
// desc: Creating super admin with all level of access to the system
const registerAdmin = async (req, res) => {
    const { fullName, lastName, email, password } = req.body

    try {
        // sanitiasing inputs
        const isEmptyFields = [fullName, lastName, email, password].some((field) => field?.trim() === "")
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
        const admin = await Admin.create({ fullName, lastName, email, password });
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

export { registerAdmin }