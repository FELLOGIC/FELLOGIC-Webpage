const FellogicLogo = ({ size = "default" }: { size?: "default" | "small" | "large" }) => {
  const sizeMap = {
    small: { svg: 20, text: "text-sm" },
    default: { svg: 26, text: "text-lg" },
    large: { svg: 36, text: "text-2xl" },
  };
  const s = sizeMap[size];
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={s.svg} height={s.svg} viewBox="0 0 36 36" fill="none" className="shrink-0">
        <rect x="2" y="2" width="32" height="32" rx="8" className="fill-primary/10 stroke-primary" strokeWidth="1.5" />
        <path d="M10 12L14 18L10 24" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 12L22 18L26 24" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="18" r="2" className="fill-primary" />
      </svg>
      <span className={`font-display ${s.text}`}>
        <span className="text-foreground">FELL</span>
        <span className="text-primary">OGIC</span>
      </span>
    </span>
  );
};

export default FellogicLogo;
