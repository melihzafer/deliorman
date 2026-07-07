import AppData from "@data/app.json";

/**
 * Restaurant phone numbers (centralized source of truth).
 *
 * Two separate lines:
 *  - Orders:  for placing orders by phone.
 *  - Reservations: for booking a table.
 *
 * Update the two constants below if the numbers change; every consumer
 * (header, footer, contact section, reservation form, offline page, etc.)
 * reads from here.
 */
export const ORDERS_PHONE_DISPLAY = "+359 89 608 8804";
export const ORDERS_PHONE_NORMALIZED = "+359896088804";

export const RESERVATIONS_PHONE_DISPLAY = "+359 89 476 62273";
export const RESERVATIONS_PHONE_NORMALIZED = "+3598947662273";

const FALLBACK_ORDERS_DISPLAY = ORDERS_PHONE_DISPLAY;
const FALLBACK_ORDERS_NORMALIZED = ORDERS_PHONE_NORMALIZED;
const FALLBACK_RESERVATIONS_DISPLAY = RESERVATIONS_PHONE_DISPLAY;
const FALLBACK_RESERVATIONS_NORMALIZED = RESERVATIONS_PHONE_NORMALIZED;

function normalizePhoneNumber(input) {
  const raw = String(input ?? "").trim();

  if (!raw) {
    return "";
  }

  let normalized = raw.replace(/[\s\-()]/g, "");

  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }

  if (normalized.startsWith("359")) {
    normalized = `+${normalized}`;
  }

  if (normalized.startsWith("08")) {
    normalized = `+359${normalized.slice(1)}`;
  }

  return normalized;
}

function getContactItems() {
  return AppData?.footer?.contact?.items ?? [];
}

function findPhoneValueByLabel(labelNeedle) {
  const items = getContactItems();
  const match = items.find((item) =>
    String(item?.label ?? "")
      .toLowerCase()
      .includes(labelNeedle),
  );
  if (match?.value) return match.value;
  return null;
}

function findFirstPhoneValue() {
  const phoneItem = getContactItems().find((item) => /\d/.test(item?.value ?? ""));
  return phoneItem?.value ?? null;
}

/**
 * Returns the phone number used for placing orders. Falls back to the
 * built-in default if the data file does not provide one.
 */
export function getOrdersPhoneDisplay() {
  return findPhoneValueByLabel("поръчк") || FALLBACK_ORDERS_DISPLAY;
}

export function getOrdersPhoneNormalized() {
  const fromData = findPhoneValueByLabel("поръчк");
  return normalizePhoneNumber(fromData) || FALLBACK_ORDERS_NORMALIZED;
}

export function getOrdersPhoneHref() {
  return `tel:${getOrdersPhoneNormalized()}`;
}

/**
 * Returns the phone number used for reservations. Falls back to the
 * built-in default if the data file does not provide one.
 */
export function getReservationsPhoneDisplay() {
  return (
    findPhoneValueByLabel("резервац") ||
    findFirstPhoneValue() ||
    FALLBACK_RESERVATIONS_DISPLAY
  );
}

export function getReservationsPhoneNormalized() {
  const fromData =
    findPhoneValueByLabel("резервац") || findFirstPhoneValue();
  return normalizePhoneNumber(fromData) || FALLBACK_RESERVATIONS_NORMALIZED;
}

export function getReservationsPhoneHref() {
  return `tel:${getReservationsPhoneNormalized()}`;
}

/**
 * Backwards-compatible aliases. The legacy single-number helpers still
 * return the reservations number, which is what older callers (e.g. the
 * header / SEO structured data) used to render.
 */
export function getRestaurantPhoneDisplay() {
  return getReservationsPhoneDisplay();
}

export function getRestaurantPhoneNormalized() {
  return getReservationsPhoneNormalized();
}

export function getRestaurantPhoneHref() {
  return `tel:${getReservationsPhoneNormalized()}`;
}
