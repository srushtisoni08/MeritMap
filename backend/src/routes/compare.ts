import { Router } from "express";
import { compareColleges } from "../controllers/collegeController";

const router = Router();

// POST /api/compare
// Body: { ids: [1, 2, 3] }
router.post("/", compareColleges);

export default router;