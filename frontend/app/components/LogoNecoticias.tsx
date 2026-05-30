export default function LogoNecoticias({ height = 80 }: { height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 115 112"
      height={height}
      aria-label="Necoticias logo"
      style={{ display: 'block' }}
    >
      {/* Bold lowercase n */}
      <text
        x="5"
        y="108"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="100"
        fill="#111110"
      >n</text>

      {/* WiFi arcs – center at top-right of n arch, spanning upper region */}
      <path d="M 63,42 A 16,16 0 0 1 87,46" fill="none" stroke="#e8000d" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 58,36 A 23,23 0 0 1 93,43" fill="none" stroke="#e8000d" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 54,31 A 30,30 0 0 1 99,39" fill="none" stroke="#e8000d" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}
