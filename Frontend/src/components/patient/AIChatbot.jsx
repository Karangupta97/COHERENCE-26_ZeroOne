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
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const GREETING = "Hello! I'm **CuraMatch AI Assistant** powered by Gemini. I have access to your medical profile and matched clinical trials.\n\nI can help you with:\n\n• Understanding your matched trials & eligibility\n• Explaining clinical trial procedures\n• Answering health-related questions\n• Navigating the platform\n\nHow can I help you today?"

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
  const { colors, fonts, mode } = useTheme()
  const isLight = mode === 'light'
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: GREETING, time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)
  const chatHistoryRef = useRef([]) // Gemini-format history

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text) => {
    if (!text.trim() || typing) return
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setError(null)
    setTyping(true)

    // Add to chat history
    chatHistoryRef.current.push({ role: 'user', content: text.trim() })

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text.trim(),
          history: chatHistoryRef.current.slice(0, -1), // exclude current msg (sent separately)
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Failed to get response')
      }

      const aiText = data.reply
      chatHistoryRef.current.push({ role: 'assistant', content: aiText })

      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', text: aiText, time: new Date()
      }])
    } catch (err) {
      setError('Unable to reach AI. Please try again.')
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        text: "I'm sorry, I couldn't process your request right now. Please try again in a moment.",
        time: new Date(), isError: true,
      }])
    } finally {
      setTyping(false)
    }
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
                  color: isLight ? '#111827' : colors.textPrimary, fontFamily: fonts.heading,
                  letterSpacing: '-0.01em',
                }}>
                  CuraMatch AI
                </div>
                <div style={{
                  fontSize: '11px', color: isLight ? '#4B5563' : colors.textSecondary,
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
                      : msg.isError ? `${colors.red || '#EF4444'}10` : colors.card,
                    color: msg.role === 'user' ? '#fff' : msg.isError ? (colors.red || '#EF4444') : isLight ? '#111827' : colors.textPrimary,
                    fontSize: fontSize.sm,
                    fontFamily: fonts.body,
                    lineHeight: 1.55,
                    border: msg.role === 'ai' ? `1px solid ${msg.isError ? (colors.red || '#EF4444') + '30' : colors.border}` : 'none',
                    boxShadow: msg.role === 'ai'
                      ? '0 1px 3px rgba(0,0,0,0.04)'
                      : `0 2px 8px ${colors.accent}25`,
                  }}>
                    {formatMessage(msg.text)}
                    <div style={{
                      fontSize: '10px',
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.55)' : isLight ? '#6B7280' : colors.textSecondary,
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
                        color: isLight ? '#111827' : colors.textPrimary,
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
                  color: isLight ? '#111827' : colors.textPrimary, fontSize: fontSize.sm,
                  fontFamily: fonts.body, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = `${colors.accent}60`}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <motion.button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                whileHover={input.trim() && !typing ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !typing ? { scale: 0.95 } : {}}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: input.trim() && !typing
                    ? colors.accent
                    : `${colors.textSecondary}15`,
                  border: 'none',
                  cursor: input.trim() && !typing ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: input.trim() && !typing ? '#fff' : colors.textSecondary,
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: input.trim() && !typing ? `0 2px 10px ${colors.accent}35` : 'none',
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
