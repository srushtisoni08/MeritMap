import { Request, Response } from "express";
import { pool } from "../db/client";

// Typed param interfaces
interface CollegeIdParam {
  collegeId: string;
}

// ─── GET /api/saved ───────────────────────────────────────────────────────────
export async function getSaved(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.location, c.city, c.state,
              c.fees_min, c.fees_max, c.rating, c.type,
              c.placement_percent, c.avg_package, c.image_url,
              c.courses, sc.created_at AS saved_at
       FROM saved_colleges sc
       JOIN colleges c ON c.id = sc.college_id
       WHERE sc.user_id = $1
       ORDER BY sc.created_at DESC`,
      [userId]
    );
    res.json({ saved: result.rows });
  } catch (err) {
    console.error("getSaved error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── POST /api/saved/:collegeId ───────────────────────────────────────────────
export async function saveCollege(
  req: Request<CollegeIdParam>,
  res: Response
): Promise<void> {
  const userId = req.user!.userId;
  const collegeId = parseInt(req.params.collegeId, 10);

  if (isNaN(collegeId)) {
    res.status(400).json({ error: "Invalid college ID" });
    return;
  }

  try {
    const check = await pool.query("SELECT id FROM colleges WHERE id = $1", [collegeId]);
    if ((check.rowCount ?? 0) === 0) {
      res.status(404).json({ error: "College not found" });
      return;
    }

    await pool.query(
      `INSERT INTO saved_colleges (user_id, college_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, college_id) DO NOTHING`,
      [userId, collegeId]
    );

    res.status(201).json({ message: "College saved", collegeId });
  } catch (err) {
    console.error("saveCollege error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── DELETE /api/saved/:collegeId ─────────────────────────────────────────────
export async function unsaveCollege(
  req: Request<CollegeIdParam>,
  res: Response
): Promise<void> {
  const userId = req.user!.userId;
  const collegeId = parseInt(req.params.collegeId, 10);

  if (isNaN(collegeId)) {
    res.status(400).json({ error: "Invalid college ID" });
    return;
  }

  try {
    await pool.query(
      `DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2`,
      [userId, collegeId]
    );
    res.json({ message: "College removed from saved", collegeId });
  } catch (err) {
    console.error("unsaveCollege error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── GET /api/saved/ids ───────────────────────────────────────────────────────
export async function getSavedIds(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      `SELECT college_id FROM saved_colleges WHERE user_id = $1`,
      [userId]
    );
    const ids = result.rows.map((r) => r.college_id as number);
    res.json({ ids });
  } catch (err) {
    console.error("getSavedIds error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}