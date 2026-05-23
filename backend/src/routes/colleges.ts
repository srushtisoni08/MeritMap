import { Router } from "express";
import {
  getColleges,
  getCollegeById,
  getStates,
  predictColleges,
} from "../controllers/collegeController";

const router = Router();

// GET /api/colleges?search=&state=&type=&fees_max=&course=&page=&limit=&sort=&order=
router.get("/", getColleges);

// GET /api/colleges/states  — must be before /:id
router.get("/states", getStates);

// GET /api/colleges/predict?exam=JEE&rank=5000
router.get("/predict", predictColleges);

// GET /api/colleges/:id
router.get("/:id", getCollegeById);

export default router;