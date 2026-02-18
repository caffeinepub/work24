/**
 * Frontend admin allowlist helper
 * 
 * Note: This module is deprecated in favor of the new username/password admin session model.
 * Admin access is now controlled via frontend/src/lib/adminSession.ts
 * 
 * The backend enforces actual authorization using username/password credentials.
 */

const ADMIN_PRINCIPALS: string[] = [
  // Deprecated: Admin access now uses username/password authentication
];

/**
 * @deprecated Use isAdminLoggedIn() from adminSession.ts instead
 */
export function isAdminPrincipal(principalString: string | undefined): boolean {
  if (!principalString) return false;
  return ADMIN_PRINCIPALS.includes(principalString);
}

/**
 * @deprecated Use isAdminLoggedIn() from adminSession.ts instead
 */
export function shouldShowAdminUI(principalString: string | undefined): boolean {
  // Deprecated: Admin UI visibility now controlled by admin session login state
  return false;
}
