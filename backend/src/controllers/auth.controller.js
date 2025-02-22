import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName,email,password } = req.body;
    try{
        //hash passwords 
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length<6){
            // Here 400 will be the status code for bad request
            return res.status(400).json({message:"Password must be atleast 6 characters long"});
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({message:"Email already exists"});

        // genSalt is used to generate a random salt
        // It's a method provided by the bcryptjs library in Node.js. It is used to generate a salt
        // which is a random value added to a password before hashing it. This helps to protect against dictionary attacks and
        // rainbow table attacks by ensuring that even if two users have the same password, their hashed passwords will be
        // different due to the unique salt.

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        });

        if ( newUser ){
            // generate jwt token here 
            generateToken(newUser._id, res);
            await newUser.save(); // save user to database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else{
            res.status(400).json({message:"Invalid User Data"});
        }
        
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
       const user = await User.findOne({email}) ;

       if (!user){
        return res.status(400).json({message:"Invalid Credentials"});
       }

       const isPasswordCorrect = await bcrypt.compare(password, user.password);
       if (!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credentials"});
       }
       
       generateToken(user._id, res);
         res.status(200).json({
              _id: user._id,
              fullName: user.fullName,
              email: user.email,
              profilePic: user.profilePic,
         });
    }

    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});   
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "" , { maxAge : 0} );
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
      coonsole.log("Error in logout controller", error.message);
      res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateProfile = async ( req, res ) => {
    try{
    const {profilePic} = req.body ;
    const userId = req.user._id ;

    if(!profilePic){
        return res.status(400).json(({message:"Profile Pic is required"}));
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic) ;
    const updatedUser = await User.findByIdAndUpdate( userId, {profile:uploadResponse.secure_url} , {new:true}) ; 
    res.status(200).json(updatedUser);
    
    } catch (error) {
    consolelog("error in update profile:" , error ) ;
    res.status(500).json({ message : "Internal Server Error " }) ;
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};