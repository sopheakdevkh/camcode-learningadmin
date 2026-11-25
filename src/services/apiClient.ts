export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  useMock: import.meta.env.VITE_USE_MOCK_API !== 'false',
  publicWebUrl: import.meta.env.VITE_PUBLIC_WEB_URL || 'http://localhost:3000',
  userAppUrl: import.meta.env.VITE_USER_APP_URL || 'http://localhost:3001',
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * All live requests to Port 4000 rely on HttpOnly session cookies (`credentials: 'include'`)
 * and never read or persist auth tokens in localStorage.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

