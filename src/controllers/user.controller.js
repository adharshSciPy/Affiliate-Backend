import { User } from "../models/user.model.js";
import { passwordValidator } from "../utils/passwordValidator.util.js";

// @POST
// user/register
// desc: Api for creating new admins
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    // sanitiasing inputs
    const isEmptyFields = [firstName, lastName, email, password, role].some(
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
    const isAlreadyExistingUser = await User.findOne({ email: email });
    if (isAlreadyExistingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    //user creation
    const user = await User.create({ firstName, lastName, email, password, role });
    const createdUser = await User.findOne({ _id: user._id }).select(
      "-password"
    );

    if (!createdUser) {
      return res.status(500).json({ message: "User registration failed" });
    }

    return res.status(201).json({ message: "User Registration Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Internal Server due to ${err.message}` });
  }
}

//@POST
// user/login
// desc:Login api of admin with credentials
const loginUser = async (req,res) =>{
  const{email,password} = req.body;
   
  try {
    //sanitiasing inputs
    const isEmptyFields = [email,password].some((field) => field?.trim() ==="");
    if(isEmptyFields){
      return res.status(400).json({ message: 'All fields are required'});

    }
    //finding user and validating
    const user = await User.findOne({email});
    if(!user) {
      return res.status(404).json({ message: "User doesn't exist" });

    }
    //verify password

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) {
      return res.status(401).json ({ message: 'Incorrect password'});


    }
    //generate access token
    const accessToken = await user.generateAccessToken();

    return res.status(200).json({message: 'User validation Successful',token: accessToken})
  } catch (err) {
    return res.status(500).json({ message:  `Internal Server due to ${err.message}`});
  }
}

//@GET
// user/users
// desc: Paginated api for getting all users with role customer

export { registerUser, loginUser }
