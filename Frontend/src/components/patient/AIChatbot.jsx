import { useState, useRef, useEffect } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineXMark, HiOutlinePaperAirplane } from 'react-icons/hi2'

const AI_RESPONSES = {
  greeting: "Hello! 👋 I'm CuraMatch AI Assistant. I can help you with:\n\n• Finding clinical trials\n• Checking your application status\n• Understanding eligibility criteria\n• Navigating the platform\n\nHow can I help you today?",
  trial: "Based on your profile, I found **5 matching clinical trials**. Your top match is **GLYCO-ADVANCE (94% match)** — a Phase III trial by Novo Nordisk in Mumbai, just 4.2 km away.\n\nWould you like to know more about this trial or see other matches?",
  eligibility: "Your eligibility is assessed using AI analysis of your medical profile. Key factors include:\n\n✓ **Age criteria** — matches\n✓ **Disease stage** — eligible\n✓ **Current medications** — no conflicts\n✓ **BMI range** — within limits\n\nYour profile completeness is **85%**. Adding latest lab results could improve match accuracy by ~15%.",
  application: "Here's your application summary:\n\n📋 **Total Submitted:** 5\n⏳ **Under Review:** 3\n✅ **Approved:** 1\n❌ **Rejected:** 1\n\n🎉 Great news — your **ONCO-TARGET** application has been approved! Next step is scheduling your screening appointment.",
  nearby: "There are **7 trials** near your location in Mumbai:\n\n1. **GLYCO-ADVANCE** — 4.2 km (94% match)\n2. **ONCO-TARGET** — 6.5 km (88% match)\n3. **NEURO-SHIELD** — 11 km (68% match)\n4. **META-RESET** — 22 km (73% match)\n\nWould you like directions to any of these?",
  help: "Here's what I can help you with:\n\n🔍 **\"Find trials\"** — Search for matching clinical trials\n📋 **\"My applications\"** — Check application status\n✅ **\"Eligibility\"** — Understand your eligibility\n📍 **\"Nearby trials\"** — Find trials near you\n💊 **\"Side effects\"** — Learn about trial procedures\n⚙️ **\"Settings\"** — Manage your preferences\n\nJust type your question!",
  sideeffects: "Clinical trial safety is our top priority. Before enrolling, you'll receive:\n\n📄 **Informed Consent Document** — details all procedures and risks\n👨‍⚕️ **Screening Visit** — medical evaluation to confirm eligibility\n🏥 **Regular Monitoring** — throughout the trial duration\n📞 **24/7 Support Line** — for any concerns during the trial\n\nWould you like to know more about a specific trial's procedures?",
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
  // Simple markdown-like formatting
  return text.split('\n').map((line, i) => {
    let formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return <p key={i} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: formatted }} />
  })
}

const QUICK_ACTIONS = [
  '🔍 Find trials',
  '📋 My applications',
  '✅ Eligibility',
  '📍 Nearby trials',
  '❓ Help',
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

    // Simulate AI thinking delay
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

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 60, height: 60, borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 20px ${colors.accent}60`,
          color: '#fff', fontSize: '26px',
        }}
      >
        {open ? <HiOutlineXMark style={{ width: 26, height: 26 }} /> : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', bottom: 100, right: 28, zIndex: 999,
              width: 380, height: 520,
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.lg,
              boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: `${spacing.md} ${spacing.lg}`,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
              display: 'flex', alignItems: 'center', gap: spacing.sm,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: fontSize.sm, fontWeight: 700, color: '#fff', fontFamily: fonts.heading }}>
                  CuraMatch AI Assistant
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  Online • Avg. response &lt;1s
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                <HiOutlineXMark style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: spacing.md,
              display: 'flex', flexDirection: 'column', gap: spacing.sm,
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: msg.role === 'user'
                      ? `${radius.md} ${radius.md} 4px ${radius.md}`
                      : `${radius.md} ${radius.md} ${radius.md} 4px`,
                    background: msg.role === 'user' ? colors.accent : colors.card,
                    color: msg.role === 'user' ? '#fff' : colors.textPrimary,
                    fontSize: fontSize.sm,
                    fontFamily: fonts.body,
                    lineHeight: 1.5,
                    border: msg.role === 'ai' ? `1px solid ${colors.border}` : 'none',
                  }}>
                    {formatMessage(msg.text)}
                    <div style={{
                      fontSize: '10px',
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                      textAlign: 'right', marginTop: 4,
                    }}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: 4, padding: `${spacing.sm} ${spacing.md}` }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: colors.textSecondary }}
                    />
                  ))}
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div style={{
                padding: `0 ${spacing.md} ${spacing.sm}`,
                display: 'flex', flexWrap: 'wrap', gap: spacing.xs,
              }}>
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa}
                    onClick={() => sendMessage(qa.substring(2))}
                    style={{
                      padding: '4px 10px', borderRadius: radius.full,
                      background: colors.accentGlow, color: colors.accent,
                      border: `1px solid ${colors.accent}30`,
                      fontSize: '11px', fontWeight: 600, fontFamily: fonts.body,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {qa}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: spacing.md,
              borderTop: `1px solid ${colors.border}`,
              display: 'flex', gap: spacing.sm, alignItems: 'center',
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: radius.full,
                  border: `1px solid ${colors.border}`, background: colors.card,
                  color: colors.textPrimary, fontSize: fontSize.sm,
                  fontFamily: fonts.body, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: input.trim() ? colors.accent : colors.border,
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0, transition: 'all 0.2s',
                }}
              >
                <HiOutlinePaperAirplane style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
