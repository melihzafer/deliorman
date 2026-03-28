import AppData from "@data/app.json";

const FALLBACK_PHONE_DISPLAY = "+359 89 4766273";
const FALLBACK_PHONE_NORMALIZED = "+359894766273";

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

function findPhoneValue() {
  const phoneItem = getContactItems().find((item) => /\d/.test(item?.value ?? ""));
  return phoneItem?.value ?? FALLBACK_PHONE_DISPLAY;
}

export function getRestaurantPhoneDisplay() {
  return findPhoneValue();
}

export function getRestaurantPhoneNormalized() {
  return normalizePhoneNumber(findPhoneValue()) || FALLBACK_PHONE_NORMALIZED;
}

export function getRestaurantPhoneHref() {
  return `tel:${getRestaurantPhoneNormalized()}`;
}
