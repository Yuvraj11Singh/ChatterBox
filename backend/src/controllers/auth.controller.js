import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";

export const signup = async (req, res) => {
    const{fullName,email,password} = req.body;
    try{
        //hash passwords 
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

        if( newUser ){
            // generate jwt token here 
            generateToken=(newUser._id,res)
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
        console.log(error);
    }
};

export const login = (req, res) => {
    res.send("login route");
};

export const logout = (req, res) => {
    res.send("logout route");
};