import { User } from "../models/user.model.js"
import { passwordValidator } from "../utils/passwordValidator.util.js"


const registerUser = async (req, res) => {
    const { firstName, lastName, email,password} = req.body
    try {
        // sanitiasing inputs
        const isEmptyFields = [firstName, lastName, email,password].some((field) => field?.trim() === "")
        if (isEmptyFields) {
            return res.status(401).json({ message: "All fields are required", })
        }

        //validate password
        const isValidPassword = passwordValidator(password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number", })
        }
        //prevent duplicate accounts
        const isAlreadyExistingUser = await User.findOne({ email: email });
        if (isAlreadyExistingUser) {
            return res.status(409).json({ message: 'Email is already in use' });
        }

        //user creation
        const user = await User.create({firstName, lastName, email,phoneNumber,password,socialLink });
        const createdUser = await User.findOne({ _id: user._id }).select('-password');

        if (!createdUser) {
            return res.status(500).json({ message: 'User registration failed' });
        }

        return res.status(201).json({ message: 'User Registration Successful' });

    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

export { registerUser }

