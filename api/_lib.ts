// Shared helpers for Vercel functions. The underscore keeps this file from becoming a route.

export function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export function errorJson(error: string, status: number): Response {
  return json({ error }, status)
}

/** Reads a required env var; throws a message that names the variable (never its value). */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing server setting ${name}.`)
  return value
}

export function bearerToken(req: Request): string | null {
  const match = /^Bearer\s+(.+)$/i.exec(req.headers.get('authorization') ?? '')
  return match ? match[1].trim() : null
}

export function serverError(): Response {
  return errorJson('Something went wrong on our side. Please try again in a moment.', 500)
}
