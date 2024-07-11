import { Token } from "../models/token.model.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js"

// @POST
// token/tokens
// desc: Create a new token by admin and asign to an affiliater
const generateToken = async (req, res) => {
    try {
        const { userId, adminId } = req.params;
        const { useCount, discount } = req.body;

        // Validate if user and admin exist
        const user = await User.findById(userId);
        const admin = await Admin.findById(adminId);
        const existingToken= await Token.findOne({userId:userId})

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        if (existingToken){
            return res.status(409).json({ message: 'Token has already created for this user' });
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

        return res.status(201).json({ message: 'Token created successfully' });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

// @GET
// token/tokens
// desc: Paginated api for getting all tokens
const getAllTokens = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    //Skip logic
    const skip = (pageNumber - 1) * limitNumber;


    try {
        //pagination logic
        const totalTokens = await Token.countDocuments()
        const totalPages = Math.ceil(totalTokens / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        //Find tokens with pagination
        const tokens = await Token.find()
            .select(" token useCount usageTimes discount ")
            .skip(skip)
            .limit(limitNumber);

        //check if tokens were found
        if (tokens.length === 0) {
            return res.status(404).json({ message: "No tokens found" });
        }
        //Respond with tokens data and pagination info
        return res.status(200).json({
            message: "Tokens data found",
            data: { tokens, hasNextPage, totalPages, currentPage: pageNumber },
        });
    }
    catch (err) {
        //Handle any errors
        return res.status(500)
            .json({ message: `Internal Server due to ${err.message}` });
    }
};

// @PATCH
// token/tokens/:tokenId
// desc: Update token usageTimes field 
const updateTokenUsage = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const token = await Token.findOne({ _id: tokenId })
        if (!token) {
            return res.status(404).json({ message: "Token doesn't exist" })
        }
        // Increment usage count
        token.useCount++;
        await token.save();


        return res.status(200).json({
            message: "Token usage incremented successfully",
            data: token,
        })

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
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

// @DELETE
// token/tokens/:tokenId
// desc: Delete a token
const deleteToken = async (req, res) => {
    const { tokenId } = req.params;
    try {
        // Find the token by Id
        const token = await Token.findOne({ _id: tokenId });
        if (!token) {
            return res.status(404).json({ message: "token not found" });
        }
        //Delete the token
        await Token.deleteOne({ _id: tokenId });
        return res.status(200).json({ message: "Token successfully deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
    }
}

export { generateToken, updateTokenUseCount, getAllTokens, updateTokenUsage, deleteToken }