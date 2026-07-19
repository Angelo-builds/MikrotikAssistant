/**
 * Secure HTTP Headers Middleware.
 * Adds production-ready security headers to protect from common vulnerabilities (XSS, clickjacking, etc.).
 */
function securityHeaders(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS Protection for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent framing (Clickjacking protection)
  res.setHeader('X-Frame-Options', 'DENY');

  // Strict Transport Security (HSTS) - Enabled if secure (production) or configured
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.openai.com https://api.anthropic.com https://openrouter.ai http://localhost:11434 http://127.0.0.1:11434;"
  );

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
}

module.exports = securityHeaders;
