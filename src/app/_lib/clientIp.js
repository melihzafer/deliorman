/**
 * Extract a client IP address in a Vercel/Next.js App Router context.
 *
 * Notes:
 * - In production behind Vercel/proxies, forwarding headers are typically present.
 * - Header values may contain a chain: "client, proxy1, proxy2".
 * - We take the first value.
 *
 * @param {Request} request
 * @returns {{ ip: string; source: string; chain: string[] }}
 */
export function getClientIp(request) {
  const chain = [];

  const normalize = (ip) => {
    let s = String(ip || '').trim();
    if (!s) return '';

    // Forwarded header can have quoted values or IPv6 in brackets, potentially with port
    // Examples:
    // - for=203.0.113.60
    // - for="203.0.113.60"
    // - for="[2001:db8:cafe::17]:4711"
    s = s.replace(/^"|"$/g, '');
    if (s.startsWith('[')) {
      const end = s.indexOf(']');
      if (end > 0) s = s.slice(1, end);
    } else {
      // If it's an IPv4:port, strip the port
      const m = s.match(/^([0-9]{1,3}(?:\.[0-9]{1,3}){3}):(\d+)$/);
      if (m) s = m[1];
    }

    // IPv6 loopback
    if (s === '::1') return 'localhost';
    // IPv4 loopback
    if (s === '127.0.0.1') return 'localhost';

    // IPv4-mapped IPv6 like ::ffff:127.0.0.1
    if (s.toLowerCase().startsWith('::ffff:')) {
      const v4 = s.slice('::ffff:'.length);
      if (v4 === '127.0.0.1') return 'localhost';
      return v4;
    }

    return s;
  };

  const pushFromHeader = (name) => {
    const v = request.headers.get(name);
    if (!v) return;
    for (const part of v.split(',')) {
      const ip = normalize(part.trim());
      if (ip) chain.push(ip);
    }
  };

  const pushFromForwardedHeader = () => {
    const v = request.headers.get('forwarded');
    if (!v) return;

    // Minimal RFC 7239 parsing: take first `for=` value
    // Example: Forwarded: for=203.0.113.43;proto=https;by=203.0.113.44
    const match = v.match(/for=([^;]+)/i);
    if (!match) return;

    const ip = normalize(match[1]);
    if (ip) chain.push(ip);
  };

  // Order matters.
  // 1) Vercel canonical client IP (single value)
  pushFromHeader('x-vercel-ip');
  // 2) Standard proxy header.
  pushFromHeader('x-forwarded-for');
  // 3) Vercel-specific chain (sometimes present).
  pushFromHeader('x-vercel-forwarded-for');
  // 4) RFC 7239.
  pushFromForwardedHeader();
  // 5) Common alternate.
  pushFromHeader('x-real-ip');

  const first = chain[0];
  if (first) {
    const source = request.headers.get('x-vercel-ip')
      ? 'x-vercel-ip'
      : request.headers.get('x-forwarded-for')
        ? 'x-forwarded-for'
        : request.headers.get('x-vercel-forwarded-for')
          ? 'x-vercel-forwarded-for'
          : request.headers.get('forwarded')
            ? 'forwarded'
            : request.headers.get('x-real-ip')
              ? 'x-real-ip'
              : 'headers';

    return { ip: first, source, chain };
  }

  // Local dev convenience: on `next dev`, proxy headers are often missing.
  // Return a stable value to make it visible in notifications.
  if (process.env.NODE_ENV !== 'production') {
    return { ip: 'localhost', source: 'dev-fallback', chain: [] };
  }

  // App Router's Request doesn't expose socket.remoteAddress.
  // If we can't infer, return "unknown".
  return { ip: 'unknown', source: 'unknown', chain: [] };
}
