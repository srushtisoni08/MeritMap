import { Request, Response } from "express";
import { pool } from "../db/client";
import type { CollegeQuery } from "../types/index";

// ─── GET /api/colleges ────────────────────────────────────────────────────────
// Supports: search, state, type, fees_max, course, page, limit, sort, order
export async function getColleges(req: Request, res: Response): Promise<void> {
  const {
    search,
    state,
    type,
    fees_max,
    course,
    page = "1",
    limit = "12",
    sort = "rating",
    order = "desc",
  } = req.query as CollegeQuery;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  // Whitelist sort columns to prevent SQL injection
  const allowedSort = ["rating", "fees_min", "placement_percent", "name"];
  const sortCol = allowedSort.includes(sort) ? sort : "rating";
  const sortDir = order === "asc" ? "ASC" : "DESC";

  const params: (string | number)[] = [];
  const conditions: string[] = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(c.name ILIKE $${params.length} OR c.city ILIKE $${params.length} OR c.state ILIKE $${params.length})`
    );
  }

  if (state) {
    params.push(state);
    conditions.push(`c.state ILIKE $${params.length}`);
  }

  if (type) {
    params.push(type);
    conditions.push(`c.type = $${params.length}`);
  }

  if (fees_max) {
    params.push(parseInt(fees_max, 10));
    conditions.push(`c.fees_min <= $${params.length}`);
  }

  if (course) {
    params.push(`%${course}%`);
    conditions.push(`EXISTS (
      SELECT 1 FROM unnest(c.courses) AS course_name
      WHERE course_name ILIKE $${params.length}
    )`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    // Total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM colleges c ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.count as string, 10);

    // Paginated results
    const dataResult = await pool.query(
      `SELECT c.id, c.name, c.location, c.city, c.state,
              c.fees_min, c.fees_max, c.rating, c.type,
              c.established, c.placement_percent, c.avg_package,
              c.highest_package, c.image_url, c.description,
              c.website, c.courses
       FROM colleges c
       ${where}
       ORDER BY c.${sortCol} ${sortDir}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limitNum, offset]
    );

    res.json({
      data: dataResult.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("getColleges error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── GET /api/colleges/:id ────────────────────────────────────────────────────
export async function getCollegeById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const collegeResult = await pool.query(
      `SELECT * FROM colleges WHERE id = $1`,
      [id]
    );

    if ((collegeResult.rowCount ?? 0) === 0) {
      res.status(404).json({ error: "College not found" });
      return;
    }

    // Fetch reviews
    const reviewsResult = await pool.query(
      `SELECT id, rating, comment, author_name, created_at
       FROM reviews
       WHERE college_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      college: collegeResult.rows[0],
      reviews: reviewsResult.rows,
    });
  } catch (err) {
    console.error("getCollegeById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── GET /api/colleges/states ─────────────────────────────────────────────────
export async function getStates(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT DISTINCT state FROM colleges ORDER BY state ASC`
    );
    res.json({ states: result.rows.map((r) => r.state as string) });
  } catch (err) {
    console.error("getStates error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── POST /api/colleges/compare ──────────────────────────────────────────────
// Body: { ids: [1, 2, 3] }
export async function compareColleges(req: Request, res: Response): Promise<void> {
  const { ids } = req.body as { ids: number[] };

  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
    res.status(400).json({ error: "Provide 2–3 college IDs to compare" });
    return;
  }

  // Validate all are integers
  if (!ids.every((id) => Number.isInteger(id) && id > 0)) {
    res.status(400).json({ error: "All IDs must be positive integers" });
    return;
  }

  try {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const result = await pool.query(
      `SELECT id, name, location, city, state,
              fees_min, fees_max, rating, type, established,
              placement_percent, avg_package, highest_package,
              image_url, description, website, courses
       FROM colleges
       WHERE id IN (${placeholders})`,
      ids
    );

    if (result.rows.length !== ids.length) {
      res.status(404).json({ error: "One or more colleges not found" });
      return;
    }

    // Return in same order as requested
    const ordered = ids.map((id) =>
      result.rows.find((r) => (r.id as number) === id)
    );

    res.json({ colleges: ordered });
  } catch (err) {
    console.error("compareColleges error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ─── GET /api/colleges/predict ───────────────────────────────────────────────
// Query: exam=JEE&rank=5000
export async function predictColleges(req: Request, res: Response): Promise<void> {
  const { exam, rank } = req.query as { exam?: string; rank?: string };

  if (!exam || !rank) {
    res.status(400).json({ error: "exam and rank are required" });
    return;
  }

  const rankNum = parseInt(rank, 10);
  if (isNaN(rankNum) || rankNum < 1) {
    res.status(400).json({ error: "rank must be a positive number" });
    return;
  }

  // Rule-based prediction logic
  // Maps rank ranges to college types for each exam
  let minRating: number;
  let collegeTypes: string[];
  let feesMax: number;

  const examUpper = exam.toUpperCase();

  if (examUpper === "JEE") {
    if (rankNum <= 500) {
      minRating = 4.7; collegeTypes = ["Government"]; feesMax = 300000;
    } else if (rankNum <= 5000) {
      minRating = 4.4; collegeTypes = ["Government", "Deemed"]; feesMax = 400000;
    } else if (rankNum <= 25000) {
      minRating = 4.0; collegeTypes = ["Government", "Deemed", "Private"]; feesMax = 450000;
    } else {
      minRating = 3.5; collegeTypes = ["Government", "Deemed", "Private"]; feesMax = 500000;
    }
  } else if (examUpper === "BITSAT") {
    if (rankNum <= 100) {
      minRating = 4.5; collegeTypes = ["Deemed"]; feesMax = 500000;
    } else if (rankNum <= 300) {
      minRating = 4.0; collegeTypes = ["Deemed", "Private"]; feesMax = 500000;
    } else {
      minRating = 3.7; collegeTypes = ["Deemed", "Private"]; feesMax = 500000;
    }
  } else {
    // Generic for MHT-CET, KCET, TANCET, etc.
    if (rankNum <= 1000) {
      minRating = 4.2; collegeTypes = ["Government", "Deemed"]; feesMax = 300000;
    } else if (rankNum <= 10000) {
      minRating = 3.9; collegeTypes = ["Government", "Deemed", "Private"]; feesMax = 400000;
    } else {
      minRating = 3.5; collegeTypes = ["Government", "Deemed", "Private"]; feesMax = 500000;
    }
  }

  const typePlaceholders = collegeTypes.map((_, i) => `$${i + 3}`).join(", ");

  try {
    const result = await pool.query(
      `SELECT id, name, location, city, state,
              fees_min, fees_max, rating, type,
              placement_percent, avg_package, courses
       FROM colleges
       WHERE rating >= $1
         AND fees_min <= $2
         AND type IN (${typePlaceholders})
       ORDER BY rating DESC, placement_percent DESC
       LIMIT 10`,
      [minRating, feesMax, ...collegeTypes]
    );

    res.json({
      exam: examUpper,
      rank: rankNum,
      colleges: result.rows,
    });
  } catch (err) {
    console.error("predictColleges error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}