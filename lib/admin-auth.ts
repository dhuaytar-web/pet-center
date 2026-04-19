function parseAllowedEmails(raw: string) {
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function getAdminAllowedEmails() {
  const configured = process.env.ADMIN_ALLOWED_EMAILS ?? ''

  if (configured.trim().length > 0) {
    return parseAllowedEmails(configured)
  }

  const fallbackOwnerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? ''
  return parseAllowedEmails(fallbackOwnerEmail)
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false

  const allowedEmails = getAdminAllowedEmails()
  if (allowedEmails.length === 0) {
    // In local development, allow authenticated users while admin allowlist is being configured.
    return process.env.NODE_ENV !== 'production'
  }

  return allowedEmails.includes(email.trim().toLowerCase())
}
