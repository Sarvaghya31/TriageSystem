import mongoose  from "mongoose";
import jwt from 'jsonwebtoken'
const moderatorAndEndUserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"admin",
        enum:["user","moderator","admin"]
    },
    skills:[String],
    createdAt:{type:Date,default:Date.now}
});



moderatorAndEndUserSchema.methods.generateAccessToken = function(){
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

export default mongoose.model("ModeratorAndEndUser",moderatorAndEndUserSchema);