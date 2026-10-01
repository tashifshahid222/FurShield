import Icon from './Icon';

/* ============================================================================
   FurShield brand mark — gradient shield + paw, reused across surfaces.
   ============================================================================ */

export const LogoMark = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="fsg-svg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2c9f89" />
        <stop offset="1" stopColor="#17675b" />
      </linearGradient>
      <linearGradient id="fsp-svg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fdb022" />
        <stop offset="1" stopColor="#f79009" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="14" r="7" fill="url(#fsg-svg)" />
    <circle cx="48" cy="14" r="7" fill="url(#fsg-svg)" />
    <circle cx="18" cy="34" r="7" fill="url(#fsg-svg)" />
    <circle cx="46" cy="34" r="7" fill="url(#fsg-svg)" />
    <path
      d="M8 38C8 33.6 11.6 30 16 30H48C52.4 30 56 33.6 56 38V44C56 52.8 48.8 60 40 60H24C15.2 60 8 52.8 8 44V38Z"
      fill="url(#fsg-svg)"
    />
    <circle cx="26" cy="42" r="2.5" fill="#fef0c7" />
    <circle cx="38" cy="42" r="2.5" fill="#fef0c7" />
    <ellipse cx="32" cy="49" rx="4" ry="3" fill="#fef0c7" />
    <circle cx="53" cy="46" r="7" fill="url(#fsp-svg)" />
    <path d="M53 43V49M50 46H56" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Logo = ({ size = 38, withName = true, className = '', light = false }) => (
  <span className={`navbar-logo ${className}`.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: 11 }}>
    <LogoMark size={size} />
    {withName && (
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.3rem',
          color: light ? '#ffffff' : 'var(--slate-900)',
        }}
      >
        Fur<span style={{ color: light ? 'var(--teal-300)' : 'var(--primary)' }}>Shield</span>
      </span>
    )}
  </span>
);

export default Logo;