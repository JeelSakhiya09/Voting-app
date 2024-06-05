import { ApiError } from "../middlewares/err.js";
import Candidate from "../models/candidate.js";
import { checkForAdminRole } from "../middlewares/authentication.js";
import User from "../models/user.js";

export async function handleCandidateRegister(req, res, next) {
  try {
    if (!(await checkForAdminRole(req.user.id)))
      throw new ApiError(403, "Only admins are valid");
    const { name, party, age } = req.body;
    if (!(name && party && age))
      throw new ApiError(400, "All feilds are reuired");

    if (await Candidate.findOne({ name }))
      throw new ApiError(400, "Candidate already exist");

    const candidate = new Candidate({
      name,
      party,
      age,
    });

    await candidate.save();

    return res.status(200).json({
      candidate,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleDisplayCandidate(req, res, next) {
  try {
    const candidate = await Candidate.findById(req.params.candidateID);

    if (!candidate) throw new ApiError(404, "Candidate not found");

    return res.status(200).json({ candidate });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateCandidate(req, res, next) {
  try {
    const { candidateDetails } = req.body;
    const candidateID = req.params.candidateID;
    if (!candidateDetails) throw new ApiError(400, "All feilds are reuired");

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      candidateDetails,
      { new: true }
    );
    if (!response) throw new ApiError(404, "Invalid candidate");

    return res.status(200).json({
      msg: "Candidate updated successfully",
      response,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleCandidateDelete(req, res, next) {
  try {
    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);
    if (!response) throw new ApiError(404, "Invalid candidate");

    return res.status(200).json({
      msg: "Candidate deleted successfully",
      response,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleUserVote(req, res, next) {
  try {
    const candidateID = req.params.candidateID;
    const user = await User.findById(req.user.id);

    if (user.isVoted) throw new ApiError(403, "You can vote only once");

    const candidate = await Candidate.findById(candidateID);

    if (!candidate) throw new ApiError(404, "Invalid candidate");

    const response = await candidate.updateOne(
      {
        $push: {
          votes: {
            user: user._id,
          },
        },
        $inc: {
            voteCount: 1,
        },
      },
      { new: true }
    );
    await user.updateOne({
      $set: {
        isVoted: true,
      },
    });

    return res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
}
