// ─── Database row types ───────────────────────────────────────────────────────

export interface College {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  fees_min: number;
  fees_max: number;
  rating: number;
  type: "Government" | "Private" | "Deemed";
  established: number | null;
  placement_percent: number | null;
  avg_package: number | null;
  highest_package: number | null;
  image_url: string | null;
  description: string | null;
  website: string | null;
  courses: string[];
  created_at: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface Review {
  id: number;
  college_id: number;
  user_id: number | null;
  rating: number;
  comment: string | null;
  author_name: string | null;
  created_at: Date;
}

export interface SavedCollege {
  id: number;
  user_id: number;
  college_id: number;
  created_at: Date;
}

// ─── Request / Response types ─────────────────────────────────────────────────

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CollegeQuery {
  search?: string;
  state?: string;
  type?: string;
  fees_max?: string;
  course?: string;
  page?: string;
  limit?: string;
  sort?: "rating" | "fees_min" | "placement_percent" | "name";
  order?: "asc" | "desc";
}

export interface JwtPayload {
  userId: number;
  email: string;
}

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}