// ============================================================
//  DataTable — Reusable sortable table with selection
// ============================================================

import { useState } from 'react';
import { useTheme } from '../../theme';

export default function DataTable({ columns, data, onAction, selectable = false, bulkActions = [] }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const [selected, setSelected] = useState([]);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const toggleAll = () => {
        if (selected.length === data.length) setSelected([]);
        else setSelected(data.map((_, i) => i));
    };

    const toggleRow = (idx) => {
        setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const headerStyle = {
        padding: `${spacing.sm} ${spacing.md}`,
        textAlign: 'left',
        fontSize: fontSize.xs,
        fontWeight: 600,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontFamily: fonts.mono,
        borderBottom: `1px solid ${colors.border}`,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        transition: 'color 0.2s ease',
    };

    const cellStyle = {
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        borderBottom: `1px solid ${colors.border}`,
        fontFamily: fonts.body,
        verticalAlign: 'middle',
    };

    return (
        <div>
            {/* Bulk Actions */}
            {selectable && selected.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.md,
                    background: colors.accentGlow,
                    borderRadius: radius.md,
                    marginBottom: spacing.md,
                    border: `1px solid ${colors.accent}33`,
                }}>
                    <span style={{ fontSize: fontSize.sm, color: colors.accent, fontWeight: 600 }}>
                        {selected.length} selected
                    </span>
                    {bulkActions.map(action => (
                        <button
                            key={action.label}
                            onClick={() => action.onClick(selected.map(i => data[i]))}
                            style={{
                                background: action.variant === 'primary' ? colors.accent : 'transparent',
                                color: action.variant === 'primary' ? '#fff' : colors.accent,
                                border: action.variant === 'primary' ? 'none' : `1px solid ${colors.accent}`,
                                padding: `${spacing.xs} ${spacing.md}`,
                                borderRadius: radius.sm,
                                fontSize: fontSize.xs,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: fonts.body,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Table */}
            <div style={{
                overflowX: 'auto',
                borderRadius: radius.lg,
                border: `1px solid ${colors.border}`,
                background: colors.card,
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {selectable && (
                                <th style={{ ...headerStyle, width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selected.length === data.length && data.length > 0}
                                        onChange={toggleAll}
                                        style={{ accentColor: colors.accent, cursor: 'pointer' }}
                                    />
                                </th>
                            )}
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    style={headerStyle}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    onMouseEnter={e => e.currentTarget.style.color = colors.accent}
                                    onMouseLeave={e => e.currentTarget.style.color = colors.textSecondary}
                                >
                                    {col.label}
                                    {sortKey === col.key && (
                                        <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, idx) => (
                            <tr
                                key={idx}
                                style={{
                                    transition: 'background 0.15s ease',
                                    background: selected.includes(idx) ? colors.accentGlow : 'transparent',
                                }}
                                onMouseEnter={e => {
                                    if (!selected.includes(idx)) e.currentTarget.style.background = `${colors.accent}08`;
                                }}
                                onMouseLeave={e => {
                                    if (!selected.includes(idx)) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {selectable && (
                                    <td style={cellStyle}>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(idx)}
                                            onChange={() => toggleRow(idx)}
                                            style={{ accentColor: colors.accent, cursor: 'pointer' }}
                                        />
                                    </td>
                                )}
                                {columns.map(col => (
                                    <td key={col.key} style={cellStyle}>
                                        {col.render ? col.render(row, idx, onAction) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
