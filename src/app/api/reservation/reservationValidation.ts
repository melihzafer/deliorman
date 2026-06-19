import { validateBgPhone } from '@library/bgPhoneUtils';

export type ReservationField =
  | 'first_name'
  | 'last_name'
  | 'phone'
  | 'person'
  | 'date'
  | 'time'
  | 'message'
  | 'privacy_consent';

export interface ReservationError {
  field?: ReservationField;
  message: string;
  detail?: string;
}

export interface ReservationErrorResponse {
  success: false;
  errors: ReservationError[];
}

export interface ReservationMethodNotAllowedResponse {
  success: false;
  error: string;
}

export interface ReservationSuccessResponse {
  success: true;
  message?: string;
  data?: {
    phone: string;
  };
}

export type ReservationRouteResponse =
  | ReservationSuccessResponse
  | ReservationErrorResponse
  | ReservationMethodNotAllowedResponse;

export interface ValidReservation {
  firstName: string;
  lastName: string;
  phone: string;
  person: string;
  date: string;
  time: string;
  message: string;
  dateBg: string;
}

type ReservationValidationResult =
  | { success: true; data: ValidReservation }
  | { success: false; errors: ReservationError[] };

const MAX_NAME_LENGTH = 80;
const MAX_PHONE_LENGTH = 32;
const MAX_MESSAGE_LENGTH = 1000;

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function findFileFields(formData: FormData): string[] {
  const fileFields: string[] = [];
  formData.forEach((value, key) => {
    if (typeof value !== 'string') fileFields.push(key);
  });
  return fileFields;
}

function parseDateTimeLocal(dateStr: string | null, timeStr: string | null): Date | null {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const [hh, mm] = String(timeStr).split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function roundUpToNextHour(date: Date): Date {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  if (date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    d.setHours(d.getHours() + 1);
  }
  return d;
}

function isPrivacyConsentAccepted(value: string | null): boolean {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes';
}

function formatDateBg(date: string): string {
  try {
    return new Date(date).toLocaleDateString('bg-BG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}

export function validateReservationForm(formData: FormData): ReservationValidationResult {
  const firstName = getFormString(formData, 'first_name');
  const lastName = getFormString(formData, 'last_name');
  const phoneRaw = getFormString(formData, 'phone');
  const person = getFormString(formData, 'person');
  const date = getFormString(formData, 'date');
  const time = getFormString(formData, 'time');
  const message = getFormString(formData, 'message') || 'Няма допълнително съобщение';
  const privacyConsentRaw = getFormString(formData, 'privacy_consent');
  const errors: ReservationError[] = [];
  const fileFields = findFileFields(formData);

  if (fileFields.length > 0) {
    errors.push({ message: 'Прикачени файлове не се поддържат за резервации.' });
  }

  if (!isPrivacyConsentAccepted(privacyConsentRaw)) {
    errors.push({
      field: 'privacy_consent',
      message: 'Моля, потвърдете, че сте се запознали с правилата и условията и информацията за лични данни.',
    });
  }

  if (!firstName || firstName.trim().length < 2) {
    errors.push({ field: 'first_name', message: 'Името трябва да е поне 2 символа' });
  } else if (firstName.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'first_name', message: 'Името е твърде дълго' });
  }

  if (!lastName || lastName.trim().length < 2) {
    errors.push({ field: 'last_name', message: 'Фамилията трябва да е поне 2 символа' });
  } else if (lastName.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'last_name', message: 'Фамилията е твърде дълга' });
  }

  const phoneCheck = validateBgPhone(phoneRaw);
  if (phoneRaw.length > MAX_PHONE_LENGTH) {
    errors.push({ field: 'phone', message: 'Телефонният номер е твърде дълъг' });
  } else if (!phoneCheck.ok) {
    errors.push({ field: 'phone', message: phoneCheck.message });
  }

  const guestsNum = Number(person);
  if (person.trim() === '') {
    errors.push({ field: 'person', message: 'Моля въведете брой гости' });
  } else if (!Number.isFinite(guestsNum) || !Number.isInteger(guestsNum)) {
    errors.push({ field: 'person', message: 'Моля въведете валиден брой гости' });
  } else if (guestsNum < 1) {
    errors.push({ field: 'person', message: 'Броят гости трябва да е поне 1' });
  } else if (guestsNum > 100) {
    errors.push({ field: 'person', message: 'Максималният брой гости е 100' });
  }

  if (!date) {
    errors.push({ field: 'date', message: 'Моля изберете дата' });
  } else {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 1);
    if (today.getDate() !== maxDate.getDate()) {
      maxDate.setDate(0);
    }
    maxDate.setHours(23, 59, 59, 999);

    if (selectedDate < today) {
      errors.push({ field: 'date', message: 'Не може да резервирате за минала дата' });
    } else if (selectedDate > maxDate) {
      errors.push({ field: 'date', message: 'Резервации могат да се правят само до 1 месец напред' });
    }
  }

  if (!time || time === 'Час') {
    errors.push({ field: 'time', message: 'Моля изберете час' });
  }

  const selectedDateTime = parseDateTimeLocal(date, time);
  if (date && time && selectedDateTime) {
    const now = new Date();
    const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    if (selectedDateTime.getTime() < now.getTime()) {
      errors.push({ field: 'time', message: 'Моля изберете бъдещ час' });
    }

    if (selectedDateTime.getTime() < minAllowed.getTime()) {
      const rounded = roundUpToNextHour(minAllowed);
      const dd = String(rounded.getDate()).padStart(2, '0');
      const mm = String(rounded.getMonth() + 1).padStart(2, '0');
      const yyyy = String(rounded.getFullYear());
      const hh = String(rounded.getHours()).padStart(2, '0');
      const min = String(rounded.getMinutes()).padStart(2, '0');
      errors.push({
        field: 'time',
        message: `Резервация може да се направи най-рано след 4 часа (след ${dd}.${mm}.${yyyy} ${hh}:${min})`,
      });
    }
  }

  if (Number.isFinite(guestsNum) && guestsNum > 20) {
    const msg = getFormString(formData, 'message').trim();
    if (msg.length < 5) {
      errors.push({
        field: 'message',
        message: 'За групи над 20 души, моля напишете кратък коментар (повод, тип събитие, изисквания).',
      });
    }
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push({ field: 'message', message: 'Съобщението не може да надвишава 1000 символа' });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      firstName,
      lastName,
      phone: phoneCheck.normalized,
      person,
      date,
      time,
      message,
      dateBg: formatDateBg(date),
    },
  };
}
