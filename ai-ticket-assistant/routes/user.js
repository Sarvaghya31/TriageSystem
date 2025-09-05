import express from "express"
import { getUsers, login, logout, signup, updateUser,moderatorVerfication,getunverifiedModerator,loginModeratorAndEndUser,signupModeratorandEndUser,getCurrentUser} from "../controllers/user.js"
import {authenticate} from "../middlewares/auth.js"
const router=express.Router();
router.post("/update-user",authenticate,updateUser);
router.get("/users",authenticate,getUsers)
router.post("/signupAdmin",signup)
router.post("/loginAdmin",login)
router.post("/logout",authenticate,logout)
router.post("/login",loginModeratorAndEndUser);
router.post("/signup",signupModeratorandEndUser);
router.post("/verification",moderatorVerfication);
router.post("/fetchUnverifiedModerator",getunverifiedModerator);
router.get("/getCurrentUser",authenticate,getCurrentUser)




export default router