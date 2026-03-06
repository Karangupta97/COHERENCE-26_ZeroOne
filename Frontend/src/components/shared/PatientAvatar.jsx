// ============================================================
//  PatientAvatar — Circle avatar with initials from ID
// ============================================================

import { useTheme } from '../../theme';

const AVATAR_COLORS = [
    '#818CF8', '#34D399', '#F59E0B', '#EF4444', '#0EA5E9',
    '#EC4899', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1',
];

export default function PatientAvatar({ patientId, size = 36 }) {
    const { radius, fonts } = useTheme();

    // Derive a consistent color from ID
    const hash = patientId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
    const initials = patientId.replace(/[^0-9]/g, '').slice(-2) || 'PT';

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: radius.full,
            background: `linear-gradient(135deg, ${color}, ${color}99)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size * 0.32}px`,
            fontWeight: 700,
            fontFamily: fonts.mono,
            color: '#fff',
            flexShrink: 0,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}>
            {initials}
        </div>
    );
}
