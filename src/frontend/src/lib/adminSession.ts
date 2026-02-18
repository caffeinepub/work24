/**
 * Admin session helper using sessionStorage
 * Manages admin authentication state for the current browser session
 */

interface AdminSession {
  adminId: string;
  password: string;
  timestamp: number;
}

const ADMIN_SESSION_KEY = 'work24_admin_session';

/**
 * Store admin credentials in session storage
 */
export function setAdminSession(adminId: string, password: string): void {
  const session: AdminSession = {
    adminId,
    password,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

/**
 * Get admin credentials from session storage
 */
export function getAdminSession(): AdminSession | null {
  const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Clear admin session
 */
export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

/**
 * Check if admin is currently logged in
 */
export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}
