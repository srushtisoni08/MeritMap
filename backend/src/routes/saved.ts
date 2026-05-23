import { Router } from "express";
import {
  getSaved,
  saveCollege,
  unsaveCollege,
  getSavedIds,
} from "../controllers/savedController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All saved routes require auth
router.use(authenticateToken);

// GET  /api/saved      — list saved colleges (full data)
router.get("/", getSaved);

// GET  /api/saved/ids  — list saved college IDs only
router.get("/ids", getSavedIds);

// POST /api/saved/:collegeId
router.post("/:collegeId", saveCollege);

// DELETE /api/saved/:collegeId
router.delete("/:collegeId", unsaveCollege);

export default router;