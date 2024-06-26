import { Router } from "express";
import { isLoggedIn } from "../middlewares/authentication.js";
import { handleUserSignIn, handleUserSignUp, handleUserSendOtp, handleUserResetPassword } from "../controllers/user.js";
import User from "../models/user.js";

const router = Router();

router.post("/register", handleUserSignUp);
router.post("/login", handleUserSignIn);

router.post("/forgot-password", handleUserSendOtp);
router.post("/reset-password", handleUserResetPassword);

router.get("/profile", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.id);
    return res.json({user });
})
router.get("/logout", isLoggedIn, (req, res) => {
    return res.clearCookie("accessToken").json({
        msg: "Logout successfully"
    });
})

export default router;