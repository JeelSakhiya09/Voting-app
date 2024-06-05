import { handleCandidateRegister, handleDisplayCandidate, handleUpdateCandidate, handleCandidateDelete, handleUserVote } from "../controllers/candidate.js";
import { Router } from "express";

const router = Router();

router.post("/register", handleCandidateRegister);
router.post("/vote/:candidateID", handleUserVote);

router.route("/:candidateID")
.get(handleDisplayCandidate)
.put(handleUpdateCandidate)
.delete(handleCandidateDelete)
export default router;
