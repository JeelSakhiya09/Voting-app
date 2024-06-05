import { ApiError } from "../middlewares/err.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken"

export async function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.headers["Authorization"].replace("Bearer ", "");
    
        if(!token) throw new ApiError(401, "Unauthorized");
    
        const userPayload = jwt.verify(token, process.env.JWT_SECRET);
        if(!userPayload) throw new ApiError(401, "Unauthorized | Token expired");
    
        req.user = userPayload;
        next();
    } catch (err) {
        next(err)
    }
}

export async function checkForAdminRole(userID) {
        const user = await User.findById(userID);
        
        if(!user) throw new ApiError(404, "User not exist");
        if(user.role == "ADMIN") return true;
}