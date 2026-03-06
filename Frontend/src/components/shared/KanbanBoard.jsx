// ============================================================
//  KanbanBoard — Draggable workflow columns
// ============================================================

import { useTheme } from '../../theme';
import StatusBadge from './StatusBadge';

const COLUMN_COLORS = {
    'Matched': '#818CF8',
    'Doctor Approved': '#34D399',
    'Accepted': '#22C55E',
    'Screened': '#F59E0B',
    'Enrolled': '#0EA5E9',
    'Rejected': '#EF4444',
};

export default function KanbanBoard({ columns, cards, onMoveCard }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    return (
        <div style={{
            display: 'flex',
            gap: spacing.sm,
            paddingBottom: spacing.md,
            minHeight: '500px',
            width: '100%',
        }}>
            {columns.map(col => {
                const colCards = cards.filter(c => c.stage === col);
                const colColor = COLUMN_COLORS[col] || colors.accent;

                return (
                    <div key={col} style={{
                        minWidth: '0',
                        flex: '1 1 0',
                        background: colors.card,
                        borderRadius: radius.lg,
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}>
                        {/* Column Header */}
                        <div style={{
                            padding: `${spacing.md} ${spacing.md}`,
                            borderBottom: `1px solid ${colors.border}`,
                            position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: colColor,
                            }} />
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <span style={{
                                    fontSize: fontSize.sm,
                                    fontWeight: 600,
                                    color: colors.textPrimary,
                                    fontFamily: fonts.body,
                                }}>
                                    {col}
                                </span>
                                <span style={{
                                    background: `${colColor}20`,
                                    color: colColor,
                                    fontSize: fontSize.xs,
                                    fontWeight: 700,
                                    borderRadius: radius.full,
                                    padding: '2px 8px',
                                    fontFamily: fonts.mono,
                                }}>
                                    {colCards.length}
                                </span>
                            </div>
                        </div>

                        {/* Cards */}
                        <div style={{
                            padding: spacing.sm,
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: spacing.sm,
                        }}>
                            {colCards.length === 0 && (
                                <div style={{
                                    padding: spacing.lg,
                                    textAlign: 'center',
                                    fontSize: fontSize.xs,
                                    color: colors.textSecondary,
                                    fontStyle: 'italic',
                                }}>
                                    No candidates
                                </div>
                            )}
                            {colCards.map(card => (
                                <div key={card.id} style={{
                                    background: colors.surface,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: radius.md,
                                    padding: spacing.md,
                                    transition: 'all 0.2s ease',
                                    cursor: 'default',
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = colColor;
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = `0 4px 12px ${colColor}20`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = colors.border;
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Card Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: spacing.sm,
                                    }}>
                                        <span style={{
                                            fontSize: fontSize.sm,
                                            fontWeight: 700,
                                            color: colors.textPrimary,
                                            fontFamily: fonts.mono,
                                        }}>
                                            {card.id}
                                        </span>
                                        <span style={{
                                            fontSize: fontSize.xs,
                                            fontWeight: 600,
                                            color: card.score >= 80 ? colors.green : card.score >= 60 ? colors.yellow : colors.red,
                                            fontFamily: fonts.mono,
                                        }}>
                                            {card.score}%
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                        marginBottom: spacing.sm,
                                    }}>
                                        {card.diagnosis && (
                                            <span style={{
                                                fontSize: '10px',
                                                padding: '2px 6px',
                                                borderRadius: radius.full,
                                                background: `${colors.accent}15`,
                                                color: colors.accent,
                                                fontWeight: 500,
                                            }}>
                                                {card.diagnosis}
                                            </span>
                                        )}
                                        <span style={{
                                            fontSize: '10px',
                                            padding: '2px 6px',
                                            borderRadius: radius.full,
                                            background: `${colors.textSecondary}15`,
                                            color: colors.textSecondary,
                                            fontWeight: 500,
                                        }}>
                                            {card.age}{card.gender}
                                        </span>
                                    </div>

                                    {/* Move Button */}
                                    {col !== 'Enrolled' && col !== 'Rejected' && onMoveCard && (
                                        <button
                                            onClick={() => onMoveCard(card.id, col)}
                                            style={{
                                                width: '100%',
                                                padding: `${spacing.xs} ${spacing.sm}`,
                                                background: `${colColor}15`,
                                                color: colColor,
                                                border: `1px solid ${colColor}30`,
                                                borderRadius: radius.sm,
                                                fontSize: fontSize.xs,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontFamily: fonts.body,
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = `${colColor}30`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = `${colColor}15`;
                                            }}
                                        >
                                            Move to Next Stage →
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
