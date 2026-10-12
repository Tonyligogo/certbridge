export function CertBridgeIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient
          id="cb-bg"
          cx="30%"
          cy="30%"
          r="70%"
          fx="30%"
          fy="30%"
        >
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      {/* Circular Badge Background */}
      <circle cx="50" cy="50" r="48" fill="url(#cb-bg)" stroke="#334155" strokeWidth="2" />

      {/* Typography / Letters */}
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="44"
        letterSpacing="-1"
      >
        <tspan fill="#ffffff">C</tspan>
        <tspan fill="#3b82f6">B</tspan>
      </text>
    </svg>
  );
}