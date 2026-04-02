interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

const ScoreRing = ({ score, size = 80, label = "Score" }: ScoreRingProps) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return "text-chart-excellent stroke-chart-excellent";
    if (score >= 50) return "text-chart-good stroke-chart-good";
    if (score >= 30) return "text-chart-average stroke-chart-average";
    return "text-chart-poor stroke-chart-poor";
  };

  const colorClass = getColor();

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={colorClass}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colorClass.split(" ")[0]}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export default ScoreRing;
