import User from "../models/user.js";
import Otp from "../models/otp.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../middlewares/err.js";
import { sendMailFN } from "../services/sendMail.js";

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

function generateOTP() {
  return Math.floor(Math.random() * (9999 - 1111) + 1111);
}

export async function handleUserSignUp(req, res, next) {
  try {
    const { name, email, address, password, aadharNumber, role } = req.body;
    if (!(name && email && address && password && aadharNumber))
      throw new ApiError(400, "All feilds are reuired");
    const isExist = await User.findOne({ email });

    if (isExist) throw new ApiError(400, "Email is already used");

    const user = new User({
      name,
      email,
      address,
      password,
      aadharNumber,
      role,
    });

    await user.save();

    return res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleUserSignIn(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) throw new ApiError(400, "All feilds are reuired");

    const user = await User.findOne({ email }).select("password");

    if (!user) throw new ApiError(404, "User not exist");

    const isValid = await user.comparePassword(password);

    if (!isValid) throw new ApiError(401, "password is not valid");

    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = generateAccessToken(payload);

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    return res.status(200).cookie("accessToken", token, options).json({
      msg: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
}

export async function handleUserSendOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, "User not found | Invalid email");

    const sendOtps = await Otp.find({ email });

    if (sendOtps.length > 5)
      throw new ApiError(
        400,
        "Too many request for otp. Please try after some time."
      );

    const otp = generateOTP();
    await Otp.create({
      email: user.email,
      otp,
    });

    const subject = "OTP for reset password";
    const text = `Hello ${user.name}, Your otp for reset-password is ${otp}. Please reset your password.`;
    await sendMailFN(email, subject, text);

    return res
      .status(200)
      .cookie("email", user.email)
      .json({ success: true, msg: "Otp sent successfully" });
  } catch (err) {
    next(err);
  }
}

export async function handleUserResetPassword(req, res, next) {
  try {
    const email = req.cookies?.email || req.headers["email"];
    if (!email) throw new ApiError(400, "Invalid email | Not authorized");
    const { otp, password } = req.body;
    if (!(otp && password)) throw new ApiError(400, "All fields are required");

    const otpData = await Otp.find({ email }).sort({ timestamps: -1 }).exec();

    const isValid = await otpData[0].compareOtp(otp);
    if (!isValid) throw new ApiError(400, "Otp expired");

    const user = await User.findOne({ email });

    await user.updateOne({
      $set: {
        password,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
}
