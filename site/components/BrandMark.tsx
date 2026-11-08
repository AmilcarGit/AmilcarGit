type BrandMarkProps = { className?: string };

export default function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" role="img" aria-label="Símbolo A de AMILCARGIT" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="amilcar-mark-gradient" x1="12" y1="88" x2="88" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8D73FF" />
          <stop offset=".55" stopColor="#C7B4FF" />
          <stop offset="1" stopColor="#69E8FF" />
        </linearGradient>
      </defs>
      <path d="M50 5 94 83 78 92 50 43 22 92 6 83 50 5Z" fill="none" stroke="url(#amilcar-mark-gradient)" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M31 67h38" stroke="url(#amilcar-mark-gradient)" strokeWidth="5" strokeLinecap="round"/>
      <path d="m50 5 8 15-8 8-8-8 8-15Z" fill="#8CEBFF"/>
      <circle cx="88" cy="22" r="4" fill="#8CEBFF"/>
    </svg>
  );
}
