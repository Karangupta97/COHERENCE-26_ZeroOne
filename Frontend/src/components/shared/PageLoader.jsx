// ============================================================
//  PageLoader — Full-screen loading spinner for Suspense fallback
// ============================================================

import { motion } from 'framer-motion'

const ACCENT = '#818CF8'     // aurora default
const BG = '#04051A'         // aurora dark bg

export default function PageLoader() {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: BG,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 20,
        }}>
            {/* Spinning ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                    width: 48, height: 48, borderRadius: '50%',
                    border: `3px solid ${ACCENT}20`,
                    borderTopColor: ACCENT,
                }}
            />

            {/* Brand text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{
                    fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em',
                    fontFamily: "'Satoshi', sans-serif",
                    color: ACCENT,
                }}
            >
                CuraMatch AI
            </motion.div>
        </div>
    )
}
