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
                    stroke={`${colors.border}60`}
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
