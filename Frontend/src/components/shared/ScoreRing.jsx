import React from 'react';
import { useTheme } from '../../theme';

export default function ScoreRing({ score, size = 64, strokeWidth = 5 }) {
    const { colors, fonts } = useTheme();
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;

    let ringColor = colors.red;
    if (score >= 85) ringColor = colors.green;
    else if (score >= 65) ringColor = colors.yellow;

    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={`${colors.border}`}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
                />
            </svg>
            <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: fonts.mono,
                fontWeight: 600,
                fontSize: size > 56 ? '15px' : '12px',
                color: ringColor,
                transition: 'color 0.3s ease',
            }}>
                {score}%
            </span>
        </div>
    );
}
