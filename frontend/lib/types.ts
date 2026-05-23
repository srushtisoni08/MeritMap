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
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  author_name: string | null;
  created_at: string;
}

export interface CollegeDetail {
  college: College;
  reviews: Review[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollegesResponse {
  data: College[];
  pagination: Pagination;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface CollegeFilters {
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