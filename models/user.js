import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  aadharNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["VOTER", "ADMIN"],
    default: "VOTER",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  const regex = /@*\.com/;
  if (!regex.test(user.email)) throw new Error("Invalid email");

  if (!user.isModified("password")) return next();

  user.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("updateOne", async function(next) {
  const update = this.getUpdate();
  if(update.$set && update.$set.password) {
    update.$set.password = await bcrypt.hash(update.$set.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(userProvidedHash) {
    const user = this;
  const isValid = await bcrypt.compare(userProvidedHash, user.password);
  return isValid;
};

const User = model("user", userSchema);

export default User;
