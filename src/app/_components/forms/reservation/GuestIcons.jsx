export default function GuestIcons({ count }) {
  const shown = Math.min(count, 8);
  const extra = count > 8 ? count - 8 : 0;
  return (
    <div className="rsv-guest-icons" aria-hidden="true">
      {Array.from({ length: shown }).map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="7" r="4" />
          <path d="M12 13c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z" />
        </svg>
      ))}
      {extra > 0 && <span className="rsv-guest-extra">+{extra}</span>}
    </div>
  );
}
