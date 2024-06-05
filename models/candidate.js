import { model, Schema } from "mongoose";

const candidateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  party: {
    type: String,
    reuired: true,
  },
  age: {
    type: Number,
    required: true,
  },
  votes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      votedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

const Candidate = model("candidate", candidateSchema);

export default Candidate;
