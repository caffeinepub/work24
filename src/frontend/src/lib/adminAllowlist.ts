/**
 * Frontend admin allowlist helper
 * This should match the backend admin configuration
 * 
 * Note: This is for UI visibility only. The backend enforces actual authorization.
 */

const ADMIN_PRINCIPALS: string[] = [
  // Add admin principal IDs here
  // Example: '2vxsx-fae'
];

/**
 * Checks if the given principal string is in the admin allowlist
 */
export function isAdminPrincipal(principalString: string | undefined): boolean {
  if (!principalString) return false;
  return ADMIN_PRINCIPALS.includes(principalString);
}

/**
 * Checks if the current user appears to be an admin based on frontend allowlist
 * This is used for conditional UI rendering only
 */
export function shouldShowAdminUI(principalString: string | undefined): boolean {
  // For now, show admin UI to all authenticated users
  // The backend will enforce actual authorization
  // This allows admins to see the link and attempt access
  return !!principalString;
}
