import React from "react";
import { Flame } from "lucide-react";

type Props = {
  streak: number;
  max?: number;
  size?: number; // px
};

const Streak: React.FC<Props> = ({ streak, max = 7, size = 80 }) => {
  const radius = 32;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(streak, max));
  const progress = clamped / max;
  const strokeDashoffset = circumference - progress * circumference;

  // Progress bar and flame color change based on streak value
  let progressColor = "#d1d5db"; // gray-300
  let flameColor = "text-gray-400";

  if (streak >= max * 0.85) {
    progressColor = "#ef4444"; // red-500
    flameColor = "text-red-500";
  } else if (streak >= max * 0.7) {
    progressColor = "#f97316"; // orange-500
    flameColor = "text-orange-500";
  } else if (streak >= max * 0.4) {
    progressColor = "#f59e0b"; // amber-500
    flameColor = "text-amber-500";
  } else if (streak >= max * 0.2) {
    progressColor = "#fbbf24"; // amber-400
    flameColor = "text-amber-400";
  } else if (streak > 0) {
    progressColor = "#9ca3af"; // gray-400
    flameColor = "text-gray-400";
  }

  return (
    <div className="flex items-center" style={{ width: size }}>
      <div className="relative flex items-center justify-center">
        <svg height={size} width={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            stroke={progressColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
            <Flame
              className={`${flameColor} w-7 h-7 transition-colors duration-300`}
            />
            <span className="text-sm font-semibold mt-0.5">{streak}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streak;
