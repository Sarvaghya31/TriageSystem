import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"admin",
        enum:["user","moderator","admin"]
    },
    domain:{
       type:String,
       unique:true
    },
    skills:[String],
    createdAt:{type:Date,default:Date.now},
});


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {_id:this._id,
          role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export default mongoose.model("User",userSchema)