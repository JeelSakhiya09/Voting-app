import { Router } from "express";
import { isLoggedIn } from "../middlewares/authentication.js";
import { handleUserSignIn, handleUserSignUp } from "../controllers/user.js";

const router = Router();

router.post("/register", handleUserSignUp);
router.post("/login", handleUserSignIn);
router.get("/profile", isLoggedIn, (req, res) => {
    return res.send("You are loggedIn");
})
router.get("/logout", isLoggedIn, (req, res) => {
    return res.clearCookie("accessToken").json({
        msg: "Logout successfully"
    });
})

export default router;