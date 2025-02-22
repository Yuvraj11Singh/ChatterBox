import mongoose from "mongoose";
import mogoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    email:{
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type:  String,
        required: true,    
    },
    password: {
        type: String,
        required:  true,
        minlength: 6,
        
    },
    profilepic: {
        type: String,
        default: "",

    },
    },
    { timestamps:true } // To help identify since when yoou have been a member of the platform 
);

const User = mongoose.model("User", userSchema);

export default User;