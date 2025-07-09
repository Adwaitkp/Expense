// Simple in-memory rate limiter (per IP)
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 10;
const ipRequestLogs: { [ip: string]: number[] } = {};

export function rateLimit(request: Request): { allowed: boolean; retryAfter?: number } {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  if (!ipRequestLogs[ip]) {
    ipRequestLogs[ip] = [];
  }
  // Remove timestamps older than window
  ipRequestLogs[ip] = ipRequestLogs[ip].filter(ts => now - ts < rateLimitWindowMs);
  if (ipRequestLogs[ip].length >= maxRequestsPerWindow) {
    const retryAfter = Math.ceil((rateLimitWindowMs - (now - ipRequestLogs[ip][0])) / 1000);
    return { allowed: false, retryAfter };
  }
  ipRequestLogs[ip].push(now);
  return { allowed: true };
} 