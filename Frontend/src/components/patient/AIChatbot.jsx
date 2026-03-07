import { useState, useRef, useEffect } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineChatBubbleLeftRight,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineQuestionMarkCircle,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlinePhoneArrowUpRight,
  HiOutlineBoltSlash,
  HiOutlineChevronDown,
} from 'react-icons/hi2'

const AI_RESPONSES = {
  greeting: "Hello! I'm CureMatch AI Assistant. I can help you with:\n\n• Finding clinical trials\n• Checking your application status\n• Understanding eligibility criteria\n• Navigating the platform\n\nHow can I help you today?",
  trial: "Based on your profile, I found **5 matching clinical trials**. Your top match is **GLYCO-ADVANCE (94% match)** — a Phase III trial by Novo Nordisk in Mumbai, just 4.2 km away.\n\nWould you like to know more about this trial or see other matches?",
  eligibility: "Your eligibility is assessed using AI analysis of your medical profile. Key factors include:\n\n• **Age criteria** — matches\n• **Disease stage** — eligible\n• **Current medications** — no conflicts\n• **BMI range** — within limits\n\nYour profile completeness is **85%**. Adding latest lab results could improve match accuracy by ~15%.",
  application: "Here's your application summary:\n\n• **Total Submitted:** 5\n• **Under Review:** 3\n• **Approved:** 1\n• **Rejected:** 1\n\nGreat news — your **ONCO-TARGET** application has been approved! Next step is scheduling your screening appointment.",
  nearby: "There are **7 trials** near your location in Mumbai:\n\n1. **GLYCO-ADVANCE** — 4.2 km (94% match)\n2. **ONCO-TARGET** — 6.5 km (88% match)\n3. **NEURO-SHIELD** — 11 km (68% match)\n4. **META-RESET** — 22 km (73% match)\n\nWould you like directions to any of these?",
  help: "Here's what I can help you with:\n\n• **\"Find trials\"** — Search for matching clinical trials\n• **\"My applications\"** — Check application status\n• **\"Eligibility\"** — Understand your eligibility\n• **\"Nearby trials\"** — Find trials near you\n• **\"Side effects\"** — Learn about trial procedures\n• **\"Settings\"** — Manage your preferences\n\nJust type your question!",
  sideeffects: "Clinical trial safety is our top priority. Before enrolling, you'll receive:\n\n• **Informed Consent Document** — details all procedures and risks\n• **Screening Visit** — medical evaluation to confirm eligibility\n• **Regular Monitoring** — throughout the trial duration\n• **24/7 Support Line** — for any concerns during the trial\n\nWould you like to know more about a specific trial's procedures?",
  default: "I understand your question. Let me help you with that.\n\nHere are some things I can assist with:\n• Finding clinical trials matching your profile\n• Checking application status\n• Understanding eligibility criteria\n• Getting directions to trial locations\n\nCould you provide more details about what you need?"
}

function getAIResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('trial') && (lower.includes('find') || lower.includes('search') || lower.includes('match'))) return AI_RESPONSES.trial
  if (lower.includes('eligib') || lower.includes('criteria') || lower.includes('qualify')) return AI_RESPONSES.eligibility
  if (lower.includes('application') || lower.includes('status') || lower.includes('submitted') || lower.includes('approved') || lower.includes('rejected')) return AI_RESPONSES.application
  if (lower.includes('nearby') || lower.includes('near me') || lower.includes('location') || lower.includes('direction') || lower.includes('close')) return AI_RESPONSES.nearby
  if (lower.includes('help') || lower.includes('what can') || lower.includes('how to')) return AI_RESPONSES.help
  if (lower.includes('side effect') || lower.includes('safety') || lower.includes('risk') || lower.includes('procedure')) return AI_RESPONSES.sideeffects
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) return AI_RESPONSES.greeting
  return AI_RESPONSES.default
}

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    let formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return <p key={i} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: formatted }} />
  })
}

const QUICK_ACTIONS = [
  { label: 'Find trials', icon: HiOutlineMagnifyingGlass },
  { label: 'My applications', icon: HiOutlineClipboardDocumentList },
  { label: 'Eligibility', icon: HiOutlineCheckBadge },
  { label: 'Nearby trials', icon: HiOutlineMapPin },
  { label: 'Help', icon: HiOutlineQuestionMarkCircle },
]

export default function AIChatbot() {
  const { colors, fonts } = useTheme()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: AI_RESPONSES.greeting, time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const aiResponse = { id: Date.now() + 1, role: 'ai', text: getAIResponse(text), time: new Date() }
      setMessages(prev => [...prev, aiResponse])
      setTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ── Styles ──
  const fabSize = 56

  return (
    <>
      {/* ── Floating Action Button ── */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: fabSize, height: fabSize, borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 24px ${colors.accent}50, 0 2px 8px rgba(0,0,0,0.15)`,
          color: '#fff',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <HiOutlineChevronDown style={{ width: 22, height: 22 }} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <HiOutlineChatBubbleLeftRight style={{ width: 24, height: 24 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Notification dot ── */}
      {!open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'fixed', bottom: 28 + fabSize - 10, right: 28, zIndex: 1001,
            width: 14, height: 14, borderRadius: '50%',
            background: colors.green || '#22C55E',
            border: `2.5px solid ${colors.surface || '#111820'}`,
          }}
        />
      )}

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', bottom: 96, right: 28, zIndex: 999,
              width: 400, height: 560,
              background: colors.surface || '#1a1a2e',
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              boxShadow: `0 12px 48px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.15)`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '16px 20px',
              background: colors.surface,
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {/* AI avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.accent}18, ${colors.accent}08)`,
                border: `1px solid ${colors.accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <HiOutlineSparkles style={{ width: 20, height: 20, color: colors.accent }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: fontSize.sm, fontWeight: 700,
                  color: colors.textPrimary, fontFamily: fonts.heading,
                  letterSpacing: '-0.01em',
                }}>
                  CureMatch AI
                </div>
                <div style={{
                  fontSize: '11px', color: colors.textSecondary,
                  display: 'flex', alignItems: 'center', gap: 5, marginTop: 1,
                  fontFamily: fonts.body,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: colors.green || '#22C55E',
                    display: 'inline-block',
                    boxShadow: `0 0 6px ${colors.green || '#22C55E'}60`,
                  }} />
                  Online · Ready to help
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: colors.card, border: `1px solid ${colors.border}`,
                  borderRadius: 8, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: colors.textSecondary,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.accent}12`; e.currentTarget.style.color = colors.accent }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colors.card; e.currentTarget.style.color = colors.textSecondary }}
              >
                <HiOutlineXMark style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* ── Messages ── */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    gap: 8,
                    alignItems: 'flex-end',
                  }}
                >
                  {/* Avatar */}
                  {msg.role === 'ai' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${colors.accent}12`,
                      border: `1px solid ${colors.accent}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <HiOutlineSparkles style={{ width: 14, height: 14, color: colors.accent }} />
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${colors.accent}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <HiOutlineUserCircle style={{ width: 16, height: 16, color: colors.accent }} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? '14px 14px 4px 14px'
                      : '14px 14px 14px 4px',
                    background: msg.role === 'user'
                      ? colors.accent
                      : colors.card,
                    color: msg.role === 'user' ? '#fff' : colors.textPrimary,
                    fontSize: fontSize.sm,
                    fontFamily: fonts.body,
                    lineHeight: 1.55,
                    border: msg.role === 'ai' ? `1px solid ${colors.border}` : 'none',
                    boxShadow: msg.role === 'ai'
                      ? '0 1px 3px rgba(0,0,0,0.04)'
                      : `0 2px 8px ${colors.accent}25`,
                  }}>
                    {formatMessage(msg.text)}
                    <div style={{
                      fontSize: '10px',
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.55)' : colors.textSecondary,
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                      marginTop: 6, opacity: 0.8,
                      fontFamily: fonts.body,
                    }}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: `${colors.accent}12`,
                    border: `1px solid ${colors.accent}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HiOutlineSparkles style={{ width: 14, height: 14, color: colors.accent }} />
                  </div>
                  <div style={{
                    padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    display: 'flex', gap: 4, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: 'easeInOut' }}
                        style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: colors.accent,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* ── Quick Actions ── */}
            {messages.length <= 1 && (
              <div style={{
                padding: '0 16px 10px',
                display: 'flex', flexWrap: 'wrap', gap: 6,
              }}>
                {QUICK_ACTIONS.map((qa) => {
                  const Icon = qa.icon
                  return (
                    <button
                      key={qa.label}
                      onClick={() => sendMessage(qa.label)}
                      style={{
                        padding: '6px 12px', borderRadius: 20,
                        background: colors.surface,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.border}`,
                        fontSize: '11px', fontWeight: 600, fontFamily: fonts.body,
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${colors.accent}12`
                        e.currentTarget.style.borderColor = `${colors.accent}40`
                        e.currentTarget.style.color = colors.accent
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.surface
                        e.currentTarget.style.borderColor = colors.border
                        e.currentTarget.style.color = colors.textPrimary
                      }}
                    >
                      <Icon style={{ width: 13, height: 13 }} />
                      {qa.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── Input ── */}
            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${colors.border}`,
              background: colors.surface,
              display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 12,
                  border: `1px solid ${colors.border}`, background: colors.card,
                  color: colors.textPrimary, fontSize: fontSize.sm,
                  fontFamily: fonts.body, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = `${colors.accent}60`}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <motion.button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: input.trim()
                    ? colors.accent
                    : `${colors.textSecondary}15`,
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: input.trim() ? '#fff' : colors.textSecondary,
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: input.trim() ? `0 2px 10px ${colors.accent}35` : 'none',
                }}
              >
                <HiOutlinePaperAirplane style={{ width: 16, height: 16 }} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
