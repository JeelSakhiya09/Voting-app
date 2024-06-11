import { isValidObjectId, model, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    timestamps: {
        type: Date,
        default: Date.now(),
        index: {
            expireAfterSeconds: 5 * 60 * 1000,
        }
    }
});

otpSchema.pre("save", async function(next) {
    this.otp = await hash(this.otp, 10);
    next();
});

otpSchema.methods.compareOtp = async function(otp) {
    const isValid = await compare(otp, this.otp);
    return isValid;
}

const Otp = model("otp", otpSchema);
export default Otp;