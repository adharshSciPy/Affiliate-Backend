import { Token } from "../models/token.model.js";
import { User } from "../models/user.model.js";

// @POST
// token/tokens
// desc: Create a new token by admin and asign to an affiliater
const generateToken = async (req, res) => {
    try {

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

    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server due to ${err.message}` });
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
