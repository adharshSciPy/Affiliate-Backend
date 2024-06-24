import { Token } from "../models/token.model.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js"

// @POST
// token/tokens
// desc: Create a new token by admin and asign to an affiliater
const generateToken = async (req, res) => {
    try {
        const { userId, adminId, useCount, discount } = req.body;

        // Validate if user and admin exist
        const user = await User.findById(userId);
        const admin = await Admin.findById(adminId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Create a new token
        const token = new Token({
            useCount,
            discount,
            userId,
            adminId
        });

        // Generate and save unique token
        await token.generateAndSaveUniqueToken(user.firstName, user.lastName);

        return res.status(201).json({ message: 'Token created successfully', data: token });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

// @GET
// token/tokens
// desc: Paginated api for getting all tokens
const getAllTokens = async (req, res) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

// @PATCH
// token/tokens/:tokenId
// desc: Update token usageTimes field 
const updateTokenUsage = async (req, res) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

// @PATCH
// token/tokens/:tokenId
// desc: Update token useCount field 
const updateTokenUseCount = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const { useCount } = req.body;
        const token = await Token.findOne({ _id: tokenId })
        if (!token) {
            return res.status(404).json({ message: "Token doesn't exist" })
        }
        token.useCount = useCount;
        await token.save();

        return res.status(200).json({
            message: "Token count updated successfully",
            data: token,
        });
    }
    catch (err) {
        return res.status(500).json({ message:`Internal Server due to ${err.message}` });
    }
}

// @DELETE
// token/tokens/:tokenId
// desc: Delete a token
const deleteToken = async (req, res) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

export { generateToken, updateTokenUseCount }