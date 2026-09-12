/** The institution mark: an object held inside an open bracket-circle. */
export function InstitutionMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Institute for Applied Metaphysics mark"
      className={className ?? 'inst-mark'}
    >
      <rect x="1" y="1" width="46" height="46" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle
        cx="24"
        cy="24"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="62 20"
        strokeDashoffset="18"
      />
      <rect x="22" y="22" width="4" height="4" fill="currentColor" />
      <line x1="24" y1="6" x2="24" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="38" x2="24" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="6" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="38" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}
