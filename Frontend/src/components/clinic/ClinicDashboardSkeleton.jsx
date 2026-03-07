// ============================================================
//  ClinicDashboardSkeleton — Shimmer skeleton for the clinic dashboard
// ============================================================

import { useTheme, radius, spacing } from '../../theme'

const shimmerKeyframes = `
@keyframes skeletonShimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`

function Bone({ width = '100%', height = 16, radius: r = 6, style = {} }) {
    const { colors } = useTheme()
    return (
        <div style={{
            width, height, borderRadius: r,
            background: `linear-gradient(90deg, ${colors.card} 0%, ${colors.border}50 40%, ${colors.card} 80%)`,
            backgroundSize: '800px 100%',
            animation: 'skeletonShimmer 1.5s ease-in-out infinite',
            ...style,
        }} />
    )
}

function CardSkeleton({ children, style = {} }) {
    const { colors } = useTheme()
    return (
        <div style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
            ...style,
        }}>
            {children}
        </div>
    )
}

export default function ClinicDashboardSkeleton() {
    const { colors } = useTheme()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <style>{shimmerKeyframes}</style>

            {/* ── Welcome Banner Skeleton ── */}
            <CardSkeleton style={{
                padding: `${spacing.lg} ${spacing.xl}`,
                display: 'flex', alignItems: 'center', gap: spacing.xl,
                background: `${colors.card}80`,
                border: `1px solid ${colors.border}`,
            }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Bone width={120} height={14} />
                    <Bone width={280} height={26} />
                    <Bone width={320} height={14} />
                </div>
                <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0 }}>
                    <Bone width={110} height={38} radius={6} />
                    <Bone width={140} height={38} radius={6} />
                </div>
            </CardSkeleton>

            {/* ── Gradient Line ── */}
            <div>
                <Bone width="100%" height={4} radius={2} />
                {/* ── Stat Cards Skeleton ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md, marginTop: spacing.lg }}>
                    {[0, 1, 2, 3].map(i => (
                        <CardSkeleton key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
                                <Bone width={40} height={40} radius={10} />
                                <Bone width={50} height={22} radius={999} />
                            </div>
                            <Bone width={60} height={36} style={{ marginBottom: 8 }} />
                            <Bone width={100} height={12} />
                        </CardSkeleton>
                    ))}
                </div>
            </div>

            {/* ── Two-column row 1 ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <CardSkeleton>
                    <Bone width={160} height={18} style={{ marginBottom: 20 }} />
                    <Bone width="100%" height={160} radius={10} />
                </CardSkeleton>
                <CardSkeleton>
                    <Bone width={140} height={18} style={{ marginBottom: 20 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Bone width={90} height={14} />
                                <Bone width="100%" height={10} radius={5} />
                                <Bone width={35} height={14} />
                            </div>
                        ))}
                    </div>
                </CardSkeleton>
            </div>

            {/* ── Two-column row 2 ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <CardSkeleton>
                    <Bone width={120} height={18} style={{ marginBottom: 20 }} />
                    <Bone width="100%" height={180} radius={10} />
                </CardSkeleton>
                <CardSkeleton>
                    <Bone width={180} height={18} style={{ marginBottom: 20 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Bone width={10} height={28} radius={3} />
                                <Bone width="100%" height={14} />
                                <Bone width={45} height={14} />
                            </div>
                        ))}
                    </div>
                </CardSkeleton>
            </div>

            {/* ── Bar Chart Skeleton ── */}
            <CardSkeleton>
                <Bone width={200} height={18} style={{ marginBottom: 20 }} />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
                    {[65, 80, 50, 90, 70, 85, 55, 75, 60, 88, 72, 45].map((h, i) => (
                        <Bone key={i} width="100%" height={h + '%'} radius={4} />
                    ))}
                </div>
            </CardSkeleton>

            {/* ── Weekly Trends Skeleton (full width) ── */}
            <CardSkeleton>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Bone width={200} height={18} />
                    <Bone width={110} height={26} radius={8} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.sm, marginBottom: 16 }}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{ padding: 12, borderRadius: 8, background: `${colors.card}60` }}>
                            <Bone width={80} height={10} style={{ marginBottom: 6 }} />
                            <Bone width={50} height={22} />
                        </div>
                    ))}
                </div>
                <Bone width="100%" height={200} radius={10} />
            </CardSkeleton>

            {/* ── Table Skeleton ── */}
            <CardSkeleton>
                <Bone width={180} height={18} style={{ marginBottom: 20 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 1fr', gap: spacing.md, marginBottom: 14 }}>
                    {[0, 1, 2, 3].map(i => <Bone key={i} width={60 + i * 10} height={12} />)}
                </div>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '2fr 100px 100px 1fr', gap: spacing.md,
                        alignItems: 'center', padding: `${spacing.md} 0`,
                        borderBottom: i < 3 ? `1px solid ${colors.border}40` : 'none',
                    }}>
                        <div>
                            <Bone width={140} height={14} style={{ marginBottom: 6 }} />
                            <Bone width={100} height={11} />
                        </div>
                        <Bone width={70} height={22} radius={999} />
                        <Bone width={80} height={22} radius={999} />
                        <div>
                            <Bone width="100%" height={8} radius={4} style={{ marginBottom: 6 }} />
                            <Bone width={80} height={10} />
                        </div>
                    </div>
                ))}
            </CardSkeleton>

            {/* ── Activity + Insights Skeleton ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <CardSkeleton>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Bone width={140} height={18} />
                        <Bone width={60} height={14} />
                    </div>
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: `${spacing.md} 0`, borderBottom: i < 4 ? `1px solid ${colors.border}40` : 'none' }}>
                            <Bone width={34} height={34} radius={10} style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <Bone width="80%" height={14} style={{ marginBottom: 6 }} />
                                <Bone width="60%" height={11} />
                            </div>
                            <Bone width={50} height={12} style={{ flexShrink: 0 }} />
                        </div>
                    ))}
                </CardSkeleton>
                <CardSkeleton>
                    <Bone width={120} height={18} style={{ marginBottom: 20 }} />
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            padding: spacing.md, marginBottom: spacing.sm,
                            borderLeft: `3px solid ${colors.border}`,
                            borderRadius: radius.sm,
                            background: `${colors.card}60`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Bone width={16} height={16} radius={4} />
                                <Bone width={120} height={14} />
                            </div>
                            <Bone width="90%" height={11} />
                        </div>
                    ))}
                </CardSkeleton>
            </div>
        </div>
    )
}
