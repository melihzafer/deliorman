const formStyles = `
  .rsv-wizard { max-width: 560px; margin: 0 auto; text-align: left; }

  /* Progress indicator */
  .rsv-progress { display: flex; align-items: flex-start; justify-content: center; gap: 0; margin-bottom: 32px; padding: 0 8px; }
  .rsv-progress-step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; min-width: 0; }
  .rsv-progress-circle {
    width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; background: rgba(229,235,239,1); color: rgba(26,47,51,0.5);
    transition: all 0.3s ease; position: relative; z-index: 1; flex-shrink: 0;
  }
  .rsv-progress-step.active .rsv-progress-circle { background: rgba(243,156,18,1); color: #fff; box-shadow: 0 2px 8px rgba(243,156,18,0.35); }
  .rsv-progress-step.done .rsv-progress-circle { background: rgba(46,204,113,1); color: #fff; }
  .rsv-progress-label { font-size: 11px; margin-top: 6px; color: rgba(26,47,51,0.5); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; transition: color 0.3s ease; }
  .rsv-progress-step.active .rsv-progress-label { color: rgba(243,156,18,1); font-weight: 600; }
  .rsv-progress-step.done .rsv-progress-label { color: rgba(46,204,113,1); }
  .rsv-progress-line { position: absolute; top: 18px; left: calc(50% + 22px); right: calc(-50% + 22px); height: 2px; background: rgba(229,235,239,1); z-index: 0; }
  .rsv-progress-step.done .rsv-progress-line { background: rgba(46,204,113,1); }

  /* Step content */
  .rsv-step-content { min-height: 320px; }
  .rsv-step-title { text-align: center; margin-bottom: 20px; font-size: 18px; }

  /* Calendar */
  .rsv-calendar { background: #fff; border: 1px solid rgba(229,235,239,1); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .rsv-calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .rsv-cal-nav {
    background: none; border: 1px solid rgba(229,235,239,1); border-radius: 8px; width: 36px; height: 36px;
    font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: rgba(26,47,51,1); transition: all 0.2s;
  }
  .rsv-cal-nav:hover:not(:disabled) { background: rgba(243,156,18,0.1); border-color: rgba(243,156,18,0.3); }
  .rsv-cal-nav:disabled { opacity: 0.3; cursor: default; }
  .rsv-cal-title { font-weight: 600; font-size: 15px; }
  .rsv-calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 4px; }
  .rsv-cal-weekday { text-align: center; font-size: 11px; font-weight: 700; color: rgba(26,47,51,0.45); padding: 4px 0; text-transform: uppercase; }
  .rsv-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .rsv-cal-empty { aspect-ratio: 1; }
  .rsv-cal-day {
    aspect-ratio: 1; border: none; border-radius: 8px; background: transparent; cursor: pointer;
    font-size: 14px; font-weight: 500; color: rgba(26,47,51,1); transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; position: relative;
  }
  .rsv-cal-day:hover:not(:disabled) { background: rgba(243,156,18,0.12); }
  .rsv-cal-day.rsv-cal-disabled { color: rgba(26,47,51,0.2); cursor: default; }
  .rsv-cal-day.rsv-cal-closed { color: rgba(231,76,60,0.35); text-decoration: line-through; }
  .rsv-cal-day.rsv-cal-today { font-weight: 700; box-shadow: inset 0 0 0 2px rgba(243,156,18,0.4); }
  .rsv-cal-day.rsv-cal-selected { background: rgba(243,156,18,1) !important; color: #fff !important; font-weight: 700; }
  .rsv-calendar-legend { display: flex; gap: 16px; margin-top: 10px; justify-content: center; }
  .rsv-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(26,47,51,0.55); }
  .rsv-legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .rsv-legend-today { box-shadow: inset 0 0 0 2px rgba(243,156,18,0.5); }
  .rsv-legend-closed { background: rgba(231,76,60,0.25); }

  /* Time slots */
  .rsv-time-section { margin-top: 16px; }
  .rsv-time-label { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: rgba(26,47,51,0.75); }
  .rsv-time-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 8px; }
  .rsv-time-slot {
    padding: 10px 6px; border: 1.5px solid rgba(229,235,239,1); border-radius: 8px; background: #fff;
    cursor: pointer; font-size: 14px; font-weight: 500; text-align: center; transition: all 0.15s; color: rgba(26,47,51,1);
  }
  .rsv-time-slot:hover { border-color: rgba(243,156,18,0.5); background: rgba(243,156,18,0.06); }
  .rsv-time-slot.selected { background: rgba(243,156,18,1); border-color: rgba(243,156,18,1); color: #fff; font-weight: 700; }
  .rsv-no-slots { color: rgba(231,76,60,0.8); font-size: 13px; text-align: center; padding: 12px; }

  /* Guest counter */
  .rsv-guest-section { margin-bottom: 24px; }
  .rsv-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: rgba(26,47,51,0.75); }
  .rsv-guest-counter { display: flex; align-items: center; gap: 0; justify-content: center; margin-bottom: 8px; }
  .rsv-counter-btn {
    width: 48px; height: 48px; border: 1.5px solid rgba(229,235,239,1); background: #fff;
    font-size: 22px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; color: rgba(26,47,51,1); user-select: none;
  }
  .rsv-counter-btn:first-child { border-radius: 10px 0 0 10px; }
  .rsv-counter-btn:last-child { border-radius: 0 10px 10px 0; }
  .rsv-counter-btn:hover:not(:disabled) { background: rgba(243,156,18,0.1); border-color: rgba(243,156,18,0.3); }
  .rsv-counter-btn:disabled { opacity: 0.3; cursor: default; }
  .rsv-counter-value {
    width: 64px; height: 48px; text-align: center; font-size: 20px; font-weight: 700;
    border: 1.5px solid rgba(229,235,239,1); border-left: none; border-right: none;
    background: #fff; color: rgba(26,47,51,1); -moz-appearance: textfield; appearance: textfield; padding: 0;
  }
  .rsv-counter-value::-webkit-inner-spin-button, .rsv-counter-value::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .rsv-guest-icons { display: flex; justify-content: center; gap: 3px; color: rgba(243,156,18,0.7); flex-wrap: wrap; margin-top: 4px; }
  .rsv-guest-extra { font-size: 13px; font-weight: 600; color: rgba(243,156,18,0.8); align-self: center; margin-left: 2px; }

  /* Contact fields */
  .rsv-contact-fields { display: flex; flex-direction: column; gap: 12px; }
  .rsv-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .rsv-field input, .rsv-field textarea { width: 100%; }

  /* Summary */
  .rsv-summary { background: rgba(242,246,247,0.6); border: 1px solid rgba(229,235,239,1); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .rsv-summary-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(229,235,239,0.5); }
  .rsv-summary-row:last-child { border-bottom: none; }
  .rsv-summary-icon { font-size: 18px; flex-shrink: 0; width: 28px; text-align: center; }
  .rsv-summary-row strong { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(26,47,51,0.5); display: block; }
  .rsv-summary-row p { margin: 2px 0 0; font-size: 15px; font-weight: 500; color: rgba(26,47,51,1); }

  /* Wait notice */
  .rsv-wait-notice {
    display: flex; align-items: center; gap: 8px; background: rgba(243,156,18,0.08);
    border: 1px solid rgba(243,156,18,0.2); border-radius: 10px; padding: 12px 14px;
    font-size: 13px; margin-bottom: 16px; color: rgba(26,47,51,0.8);
  }
  .rsv-wait-icon { font-size: 18px; flex-shrink: 0; }

  /* Privacy consent */
  .rsv-privacy-consent { margin-bottom: 12px; }
  .rsv-consent-label { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; user-select: none; font-size: 13px; line-height: 1.5; }
  .rsv-consent-label input[type="checkbox"] { width: 22px; height: 22px; flex-shrink: 0; margin-top: 1px; cursor: pointer; }
  .rsv-consent-mini { margin-left: 4px; padding: 0; border: none; background: transparent; cursor: pointer; text-decoration: underline; color: inherit; opacity: 0.85; font-size: inherit; }

  /* Message field */
  .rsv-message-field { margin-bottom: 16px; }
  .rsv-message-field textarea { width: 100%; resize: vertical; }

  /* Navigation */
  .rsv-nav-buttons { display: flex; align-items: center; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(229,235,239,0.5); }
  .rsv-nav-spacer { flex: 1; }
  .rsv-nav-btn { min-width: 130px; }
  .rsv-submit-btn { min-width: 200px; position: relative; }

  /* Field errors */
  .rsv-field-error { color: #f44336; font-size: 13px; margin-top: 5px; margin-bottom: 4px; }
  input.error, textarea.error, select.error { border-color: #f44336 !important; }
  input:focus, select:focus, textarea:focus { border-color: #7e2010; outline: none; box-shadow: 0 0 0 3px rgba(126, 32, 16, 0.1); }
  .rsv-form-error { background-color: #ffebee; border: 1px solid #f44336; border-radius: 8px; padding: 12px; margin-top: 12px; }
  .rsv-form-error p { color: #f44336; margin: 0; font-size: 14px; }

  /* Modal */
  .rsv-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 9999; }
  .rsv-modal { width: 100%; max-width: 520px; background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 12px 34px rgba(0,0,0,0.25); }

  /* Success state */
  .rsv-success { max-width: 480px; margin: 0 auto; text-align: center; padding: 16px 0; }
  .rsv-success-icon { margin-bottom: 16px; }
  .rsv-success-title { color: #0b2e13; margin-bottom: 4px; font-size: 22px; }
  .rsv-success-sub { color: rgba(243,156,18,1); font-weight: 600; margin-bottom: 20px; font-size: 15px; }
  .rsv-success-details { background: rgba(242,246,247,0.6); border: 1px solid rgba(229,235,239,1); border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: left; }
  .rsv-detail-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 15px; }
  .rsv-detail-icon { font-size: 16px; width: 24px; text-align: center; flex-shrink: 0; }
  .rsv-success-note { font-size: 13px; color: rgba(26,47,51,0.65); margin-bottom: 20px; line-height: 1.5; }
  .rsv-success-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
  .rsv-btn-ics { font-size: 11px !important; }
  .rsv-success-phone-note { font-size: 12px; color: rgba(26,47,51,0.5); }
  .rsv-success-phone-note a { color: rgba(243,156,18,1); text-decoration: underline; }

  /* Mobile */
  @media (max-width: 600px) {
    .rsv-wizard { padding: 0 4px; }
    .rsv-progress-label { font-size: 10px; }
    .rsv-progress-circle { width: 32px; height: 32px; font-size: 13px; }
    .rsv-field-row { grid-template-columns: 1fr; }
    .rsv-nav-buttons { flex-direction: column-reverse; gap: 8px; }
    .rsv-nav-btn { width: 100%; min-width: 0; }
    .rsv-time-grid { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); }
    .rsv-counter-btn { width: 52px; height: 52px; font-size: 24px; }
    .rsv-counter-value { width: 72px; height: 52px; font-size: 22px; }
    .rsv-step-content { min-height: 280px; }
    .rsv-success-actions { flex-direction: column; }
    .rsv-success-actions .tst-btn { width: 100%; }
    .rsv-cal-day { font-size: 13px; }
  }
`;

export default formStyles;
