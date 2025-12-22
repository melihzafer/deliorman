"use client";

import { Formik } from 'formik';
import { useEffect, useState } from 'react';

function normalizeBgPhone(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';

  let s = raw.replace(/[\s\-()]/g, '');

  // 00359... -> +359...
  if (s.startsWith('00')) s = `+${s.slice(2)}`;

  // 359... -> +359...
  if (s.startsWith('359')) s = `+${s}`;

  // 08XXXXXXXXX -> +3598XXXXXXXX
  if (s.startsWith('08')) s = `+359${s.slice(1)}`;

  return s;
}

function validateBgPhone(input) {
  const normalized = normalizeBgPhone(input);
  if (!normalized) {
    return { ok: false, normalized: '', message: 'Задължително поле' };
  }

  if (!/^\+\d+$/.test(normalized)) {
    return {
      ok: false,
      normalized,
      message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.'
    };
  }

  if (!normalized.startsWith('+359')) {
    return {
      ok: false,
      normalized,
      message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.'
    };
  }

  // Common BG mobile length: +359 + 9 digits
  if (normalized.length !== 13) {
    return {
      ok: false,
      normalized,
      message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.'
    };
  }

  return { ok: true, normalized, message: '' };
}

function parseDateTimeLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const [hh, mm] = String(timeStr).split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function roundUpToNextHour(date) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  if (date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    d.setHours(d.getHours() + 1);
  }
  return d;
}

const TIME_OPTIONS = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

const ReservationForm = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [successModal, setSuccessModal] = useState({ open: false, phone: '' });

  // Close modal on ESC
  useEffect(() => {
    if (!successModal.open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSuccessModal({ open: false, phone: '' });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [successModal.open]);

  return (
    <>
      {successModal.open && (
        <div
          className="tst-reservation-modal-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) setSuccessModal({ open: false, phone: '' });
          }}
        >
          <div className="tst-reservation-modal">
            <h4 className="tst-mb-15">Заявката е изпратена</h4>
            <p className="tst-text tst-mb-15">
              Резервацията е изпратена успешно. Ще се обадим на <strong>{successModal.phone}</strong> за потвърждение.
            </p>
            <p className="tst-text tst-mb-30" style={{ opacity: 0.85 }}>
              Моля, изчакайте обаждане от ресторанта. Докато не бъде потвърдена по телефона, резервацията не е валидна.
            </p>
            <button className="tst-btn" type="button" onClick={() => setSuccessModal({ open: false, phone: '' })}>
              Разбрах
            </button>
          </div>
        </div>
      )}

      {/* reservation form */}
      <Formik
        initialValues={{ phone: '', first_name: '', last_name: '', time: '', date: '', person: '', message: '', company: '' }}
        validate={(values) => {
          const errors = {};

          if (!values.first_name || values.first_name.trim().length < 2) {
            errors.first_name = 'Името трябва да е поне 2 символа';
          }

          if (!values.last_name || values.last_name.trim().length < 2) {
            errors.last_name = 'Фамилията трябва да е поне 2 символа';
          }

          const phoneCheck = validateBgPhone(values.phone);
          if (!phoneCheck.ok) {
            errors.phone = phoneCheck.message;
          }

          // Guests validation (allow large groups, up to a sane max)
          const guestsNum = Number(values.person);
          if (!values.person || String(values.person).trim() === '') {
            errors.person = 'Моля въведете брой гости';
          } else if (!Number.isFinite(guestsNum) || !Number.isInteger(guestsNum)) {
            errors.person = 'Моля въведете валиден брой гости';
          } else if (guestsNum < 1) {
            errors.person = 'Броят гости трябва да е поне 1';
          } else if (guestsNum > 500) {
            errors.person = 'Моля въведете брой гости до 500';
          }

          if (!values.date) {
            errors.date = 'Моля изберете дата';
          } else {
            const selectedDate = new Date(values.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
              errors.date = 'Не може да резервирате за минала дата';
            }
          }

          if (!values.time || values.time === '') {
            errors.time = 'Моля изберете час';
          }

          // Time validation: not in the past and at least 4 hours from now
          if (values.date && values.time) {
            const selectedDateTime = parseDateTimeLocal(values.date, values.time);
            if (selectedDateTime) {
              const now = new Date();
              const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);

              if (selectedDateTime.getTime() < now.getTime()) {
                errors.time = 'Моля изберете бъдещ час';
              } else if (selectedDateTime.getTime() < minAllowed.getTime()) {
                const rounded = roundUpToNextHour(minAllowed);
                const dd = String(rounded.getDate()).padStart(2, '0');
                const mm = String(rounded.getMonth() + 1).padStart(2, '0');
                const yyyy = String(rounded.getFullYear());
                const hh = String(rounded.getHours()).padStart(2, '0');
                const min = String(rounded.getMinutes()).padStart(2, '0');
                errors.time = `Резервация може да се направи най-рано след 4 часа (след ${dd}.${mm}.${yyyy} ${hh}:${min})`;
              }
            }
          }

          // Require message/details for large groups (> 20)
          if (Number.isFinite(guestsNum) && guestsNum > 20) {
            const msg = String(values.message || '').trim();
            if (msg.length < 5) {
              errors.message = 'За групи над 20 души, моля напишете кратък коментар (повод, тип събитие, изисквания).';
            }
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitStatus({ type: '', message: '' });

          const phoneCheck = validateBgPhone(values.phone);
          if (!phoneCheck.ok) {
            setSubmitStatus({ type: 'error', message: phoneCheck.message });
            setSubmitting(false);
            return;
          }

          const data = new FormData();
          data.append('first_name', values.first_name);
          data.append('last_name', values.last_name);
          data.append('phone', phoneCheck.normalized);
          data.append('person', values.person);
          data.append('time', values.time);
          data.append('date', values.date);
          data.append('message', values.message);
          data.append('company', values.company);

          try {
            const response = await fetch('/api/reservation', {
              method: 'POST',
              body: data,
            });

            const result = await response.json();

            if (response.ok && result.success) {
              setSuccessModal({ open: true, phone: result.data?.phone || phoneCheck.normalized });
              resetForm();
            } else {
              const errorMessages = result.errors?.map((e) => e.message).join(', ') || 'Възникна проблем';
              setSubmitStatus({
                type: 'error',
                message: errorMessages,
              });
            }
          } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus({
              type: 'error',
              message: 'Грешка при резервацията. Моля, обадете се на +359 89 4766273.',
            });
          }

          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
          const filteredTimeOptions = (() => {
            // If no date selected, show full list.
            if (!values.date) return TIME_OPTIONS;

            const now = new Date();
            const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);

            return TIME_OPTIONS.filter((t) => {
              const dt = parseDateTimeLocal(values.date, t);
              if (!dt) return false;
              return dt.getTime() >= minAllowed.getTime();
            });
          })();

          return (
          <form onSubmit={handleSubmit} id="reservationForm">
            <div className="row">
              <div className="col-6 col-md-4">
                <input
                  type="text"
                  placeholder="Име *"
                  name="first_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.first_name}
                  className={errors.first_name && touched.first_name ? 'error' : ''}
                />
                {errors.first_name && touched.first_name && <div className="tst-field-error">{errors.first_name}</div>}
              </div>
              <div className="col-6 col-md-4">
                <input
                  type="text"
                  placeholder="Фамилия *"
                  name="last_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.last_name}
                  className={errors.last_name && touched.last_name ? 'error' : ''}
                />
                {errors.last_name && touched.last_name && <div className="tst-field-error">{errors.last_name}</div>}
              </div>
              <div className="col-6 col-md-4">
                <input
                  type="tel"
                  placeholder="Телефон *"
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  className={errors.phone && touched.phone ? 'error' : ''}
                  inputMode="tel"
                  autoComplete="tel"
                />
                {errors.phone && touched.phone && <div className="tst-field-error">{errors.phone}</div>}
              </div>
              <div className="col-6 col-md-4">
                {/*<label style={{ display: 'block', textAlign: 'left', marginBottom: 6 }}>*/}
                {/*  Брой гости <span style={{ opacity: 0.7 }}>(вкл. фирмени банкети)</span> **/}
                {/*</label>*/}
                <div className="tst-guests-row">
                  <div className="tst-guests-input">
                    <input
                      type="number"
                      placeholder="Брой гости *"
                      name="person"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.person}
                      min={1}
                      max={500}
                      step={1}
                      inputMode="numeric"
                      className={errors.person && touched.person ? 'error' : ''}
                    />
                    {errors.person && touched.person && <div className="tst-field-error">{errors.person}</div>}
                  </div>

                  <div className="tst-guests-chips" aria-label="Бърз избор на брой гости">
                    {[2, 4, 6, 10, 50].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className="tst-guest-chip"
                        onClick={() => {
                          handleChange({ target: { name: 'person', value: String(n) } });
                        }}
                      >
                        {n === 50 ? '50+' : n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tst-text tst-guest-chip-text" style={{ fontSize: 13, opacity: 0.8, marginTop: 6, textAlign: 'left' }}>
                  За големи групи (над 20 души) моля опишете детайли в съобщението.
                </div>
              </div>
              <div className="col-6 col-md-4">
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date}
                  className={errors.date && touched.date ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && touched.date && <div className="tst-field-error">{errors.date}</div>}
              </div>
              <div className="col-6 col-md-4">
                <select
                  name="time"
                  className={`wide ${errors.time && touched.time ? 'error' : ''}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.time}
                >
                  <option value="">Час *</option>
                  {filteredTimeOptions.length === 0 ? (
                    <option value="" disabled>
                      Няма свободни часове (изберете друга дата)
                    </option>
                  ) : (
                    filteredTimeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  )}
                </select>
                {errors.time && touched.time && <div className="tst-field-error">{errors.time}</div>}
              </div>
              <div className="col-12">
                <textarea
                  placeholder="Допълнително съобщение (незадължително)"
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  rows="4"
                  className={errors.message && touched.message ? 'error' : ''}
                />
                {errors.message && touched.message && <div className="tst-field-error">{errors.message}</div>}
              </div>

              {/* Honeypot: hidden field for bots (do not remove) */}
              <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
                <input type="text" name="company" tabIndex={-1} autoComplete="off" onChange={handleChange} value={values.company || ''} />
              </div>
            </div>

            <button className="tst-btn tst-reserve-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Изпращане...' : 'Резервирай маса'}
            </button>

            {submitStatus.message && submitStatus.type === 'error' && (
              <div className={`tst-form-status ${submitStatus.type}`}>
                <h5 style={{ color: '#f44336' }}>{submitStatus.message}</h5>
              </div>
            )}
          </form>
          );
        }}
      </Formik>
      {/* reservation form end */}

      <style jsx>{`
        .tst-field-error {
          color: #f44336;
          font-size: 13px;
          margin-top: 5px;
          margin-bottom: 10px;
        }

        input.error,
        textarea.error,
        select.error {
          border-color: #f44336 !important;
        }

        .tst-form-status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          animation: slideIn 0.3s ease;
        }

        .tst-form-status.error {
          background-color: #ffebee;
          border: 1px solid #f44336;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tst-reservation-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .tst-reservation-modal {
          width: 100%;
          max-width: 520px;
          background: #fff;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.25);
        }

        .tst-guests-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .tst-guests-input {
          min-width: 280px;
          flex: 1 1 280px;
        }

        .tst-guests-input input {
          width: 100%;
        }

        .tst-guests-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 6px;
          margin-bottom: 10px;
        }

        .tst-guest-chip-text {
          margin-bottom: 20px;
        }

        .tst-guest-chip {
          appearance: none;
          border: 1px solid rgba(126, 32, 16, 0.35);
          background: rgba(126, 32, 16, 0.06);
          color: #7e2010;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .tst-guest-chip:hover {
          background: rgba(126, 32, 16, 0.12);
          border-color: rgba(126, 32, 16, 0.55);
        }

        .tst-guest-chip:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(126, 32, 16, 0.18);
        }

        .tst-reserve-submit {
          display: block;
          margin-left: auto;
          margin-right: auto;
          min-width: 220px;
        }

        @media (max-width: 767px) {
          .tst-reserve-submit {
            width: 100%;
            min-width: 0;
          }
        }

        /* Responsive: on small screens stack input + chips nicely */
        @media (max-width: 767px) {
          .tst-guests-row {
            flex-direction: column;
            gap: 10px;
          }

          .tst-guests-input {
            min-width: 0;
            width: 100%;
            flex: 1 1 auto;
          }

          .tst-guests-chips {
            padding-top: 0;
            margin-bottom: 6px;
          }

          .tst-guest-chip {
            padding: 8px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};
export default ReservationForm;

