// Simple auth utility - replace with proper JWT/auth in production

export function verifyAdminAuth(authHeader: string | null): boolean {
  if (!authHeader) {
    return false
  }

  // In production, implement proper JWT verification
  // For now, check if it's a valid token format
  // You can use: const token = authHeader.replace('Bearer ', '')
  // Then verify with JWT library

  // Placeholder: accept any non-empty header for development
  // TODO: Implement proper JWT verification
  return authHeader.length > 0
}

export function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return null
  }

  // Remove "Bearer " prefix if present
  return authHeader.replace(/^Bearer\s+/i, "")
}

