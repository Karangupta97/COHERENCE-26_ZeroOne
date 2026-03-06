// ============================================================
//  ScoreRing — SVG circular score indicator
// ============================================================

import { useTheme } from '../../theme';

export default function ScoreRing({ score, size = 48, strokeWidth = 4 }) {
    const { colors, fonts, fontSize } = useTheme();
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (score / 100) * circumference;

    const ringColor = score >= 80 ? colors.green : score >= 60 ? colors.yellow : colors.red;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={`${colors.border}60`}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: size > 40 ? fontSize.sm : '10px',
                fontWeight: 700,
                fontFamily: fonts.mono,
                color: ringColor,
            }}>
                {score}
            </div>
        </div>
    );
}
