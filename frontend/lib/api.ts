import type {
  College,
  CollegeDetail,
  CollegesResponse,
  CollegeFilters,
  AuthResponse,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mm_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? `HTTP ${res.status}`
    );
  }
  return json as T;
}

// ─── Colleges ─────────────────────────────────────────────────────────────────

export async function fetchColleges(
  filters: CollegeFilters = {}
): Promise<CollegesResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  return request<CollegesResponse>(`/api/colleges${qs ? `?${qs}` : ""}`);
}

export async function fetchCollege(id: number): Promise<CollegeDetail> {
  return request<CollegeDetail>(`/api/colleges/${id}`);
}

export async function fetchStates(): Promise<{ states: string[] }> {
  return request<{ states: string[] }>("/api/colleges/states");
}

export async function fetchPredict(
  exam: string,
  rank: number
): Promise<{ exam: string; rank: number; colleges: College[] }> {
  return request<{ exam: string; rank: number; colleges: College[] }>(
    `/api/colleges/predict?exam=${encodeURIComponent(exam)}&rank=${rank}`
  );
}

// ─── Compare ──────────────────────────────────────────────────────────────────

export async function compareColleges(
  ids: number[]
): Promise<{ colleges: College[] }> {
  return request<{ colleges: College[] }>("/api/compare", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── Saved ────────────────────────────────────────────────────────────────────

export async function fetchSaved(): Promise<{ saved: College[] }> {
  return request<{ saved: College[] }>("/api/saved");
}

export async function fetchSavedIds(): Promise<{ ids: number[] }> {
  return request<{ ids: number[] }>("/api/saved/ids");
}

export async function saveCollege(id: number): Promise<void> {
  await request(`/api/saved/${id}`, { method: "POST" });
}

export async function unsaveCollege(id: number): Promise<void> {
  await request(`/api/saved/${id}`, { method: "DELETE" });
}