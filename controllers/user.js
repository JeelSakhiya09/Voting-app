import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../middlewares/err.js";

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
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
      role
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
      maxAge: 24*60*60*1000,
    };

    return res.status(200).cookie("accessToken", token, options).json({
      msg: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
}
