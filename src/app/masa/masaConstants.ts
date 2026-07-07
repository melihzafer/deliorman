export const PING_INTERVAL_MS = 60_000;
export const COOLDOWN_MS = 180_000;
export const SUCCESS_MS = 5_000;
export const SESSION_KEY_PREFIX = "deliorman.masa.session";
export const COOLDOWN_KEY_PREFIX = "deliorman.masa.cooldown";

/**
 * Waiter-call feature flag.
 *
 * When false the QR-menu waiter-call hook short-circuits the network
 * request and the floating action button is rendered as disabled.
 * The code paths are kept intact so the feature can be re-enabled
 * by flipping this single constant.
 */
export const WAITER_CALL_ENABLED = false;

const LOCAL_TEST_HOSTS = new Set([
  "localhost:3000",
  "localhost:3001",
  "localhost:3010",
  "127.0.0.1:3000",
  "127.0.0.1:3001",
  "127.0.0.1:3010",
  "192.168.0.108:3000",
  "192.168.0.108:3001",
  "192.168.0.108:3010",
  "100.112.143.11:3000",
  "100.112.143.11:3001",
  "100.112.143.11:3010",
]);

export function isLocalTestHost(): boolean {
  return typeof window !== "undefined" && LOCAL_TEST_HOSTS.has(window.location.host.toLowerCase());
}
