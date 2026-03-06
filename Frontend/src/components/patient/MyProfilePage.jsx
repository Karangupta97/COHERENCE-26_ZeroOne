import { useState, useRef } from 'react'
import { useTheme, radius, spacing, fontSize, PATIENTS } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineUserCircle,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineShieldCheck,
  HiOutlineMapPin,
  HiOutlineHeart,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineArrowUpTray,
  HiOutlineTrash,
  HiOutlineEye,
} from 'react-icons/hi2'

const PATIENT = PATIENTS[0]

const INITIAL_RECORDS = [
  { id: 1, name: 'Blood Work Report - Feb 2026',  date: '28 Feb 2026', type: 'Lab Report',    size: '1.2 MB' },
  { id: 2, name: 'HbA1c Test Results',            date: '15 Feb 2026', type: 'Lab Report',    size: '0.8 MB' },
  { id: 3, name: 'Cardiology Consultation Notes',  date: '01 Feb 2026', type: 'Consultation',  size: '0.5 MB' },
  { id: 4, name: 'MRI Scan - Abdominal',          date: '10 Jan 2026', type: 'Imaging',       size: '15.3 MB' },
]

export default function MyProfilePage() {
  const { colors, fonts } = useTheme()
  const fileInputRef = useRef(null)

  // ── Edit Profile state ──
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    fullName: 'Rajesh Kumar',
    age: `${PATIENT.age}`,
    gender: PATIENT.gender === 'F' ? 'Female' : 'Male',
    location: PATIENT.location,
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '42, Andheri West, Mumbai, Maharashtra 400058',
    diagnosis: PATIENT.diagnosis,
    medications: PATIENT.meds,
    hba1c: PATIENT.hba1c,
    bmi: PATIENT.bmi,
    bloodType: 'B+',
    allergies: 'None reported',
  })
  const [savedProfile, setSavedProfile] = useState({ ...profile })
  const [saveToast, setSaveToast] = useState(false)

  // ── Records state ──
  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [viewingRecord, setViewingRecord] = useState(null)
  const [uploadToast, setUploadToast] = useState(null)

  // ── Handlers ──
  const handleEditToggle = () => {
    if (editing) {
      // Cancel — restore saved
      setProfile({ ...savedProfile })
    }
    setEditing(!editing)
  }

  const handleSave = () => {
    setSavedProfile({ ...profile })
    setEditing(false)
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newRecords = files.map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: file.type.includes('image') ? 'Imaging' : file.type.includes('pdf') ? 'Lab Report' : 'Document',
      size: file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
      file: file,
    }))

    setRecords([...newRecords, ...records])
    setUploadToast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`)
    setTimeout(() => setUploadToast(null), 3000)
    e.target.value = ''
  }

  const handleDeleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id))
  }

  const handleViewRecord = (record) => {
    if (record.file) {
      // Open the uploaded file in new tab
      const url = URL.createObjectURL(record.file)
      window.open(url, '_blank')
    } else {
      setViewingRecord(viewingRecord?.id === record.id ? null : record)
    }
  }

  // ── Styles ──
  const cardStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: colors.shadow,
    padding: spacing.lg,
  }

  const labelStyle = {
    fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: '1px',
    fontFamily: fonts.mono || fonts.body, marginBottom: 4,
  }

  const valueStyle = {
    fontSize: fontSize.base, fontWeight: 500, color: colors.textPrimary,
    fontFamily: fonts.body,
  }

  const inputStyle = {
    width: '100%', padding: '8px 10px', borderRadius: radius.sm,
    border: `1px solid ${colors.accent}40`, background: colors.card,
    color: colors.textPrimary, fontSize: fontSize.sm, fontFamily: fonts.body,
    outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  // Use a plain function (not a component) to avoid remounting on every render
  const renderField = (label, field) => (
    <div key={field}>
      <div style={labelStyle}>{label}</div>
      {editing ? (
        <input
          key={`input-${field}`}
          value={profile[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          style={inputStyle}
        />
      ) : (
        <div style={valueStyle}>{profile[field]}</div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, position: 'relative' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Toast notifications */}
      <AnimatePresence>
        {saveToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 80, right: 32, zIndex: 100, background: colors.green, color: '#fff', padding: `${spacing.sm} ${spacing.lg}`, borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.sm, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
          >
            <HiOutlineCheckCircle style={{ width: 18, height: 18 }} /> Profile saved successfully!
          </motion.div>
        )}
        {uploadToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 80, right: 32, zIndex: 100, background: colors.accent, color: '#fff', padding: `${spacing.sm} ${spacing.lg}`, borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.sm, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
          >
            <HiOutlineArrowUpTray style={{ width: 18, height: 18 }} /> {uploadToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: spacing.xl, position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})` }} />
        <div style={{
          width: 80, height: 80, borderRadius: radius.full,
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '28px', fontWeight: 800, fontFamily: fonts.heading, flexShrink: 0,
        }}>
          {profile.fullName.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: fontSize.xxl, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
            {profile.fullName}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body }}>
            {PATIENT.id} • {profile.age} yrs • {profile.gender} • 📍 {profile.location}
          </p>
          <div style={{ marginTop: spacing.sm, display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            <span style={{ fontSize: fontSize.xs, padding: '3px 10px', borderRadius: radius.full, background: colors.accentGlow, color: colors.accent, fontWeight: 600 }}>{profile.diagnosis}</span>
            <span style={{ fontSize: fontSize.xs, padding: '3px 10px', borderRadius: radius.full, background: colors.greenGlow, color: colors.green, fontWeight: 600 }}>{PATIENT.matches} Trial Matches</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0 }}>
          {editing && (
            <button onClick={handleSave} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: `8px ${spacing.md}`, borderRadius: radius.sm,
              background: colors.green, color: '#fff',
              border: 'none', fontSize: fontSize.sm, fontWeight: 600,
              fontFamily: fonts.body, cursor: 'pointer',
            }}>
              <HiOutlineCheckCircle style={{ width: 16, height: 16 }} /> Save
            </button>
          )}
          <button onClick={handleEditToggle} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: `8px ${spacing.md}`, borderRadius: radius.sm,
            background: editing ? `${colors.red}18` : colors.accentGlow,
            color: editing ? colors.red : colors.accent,
            border: `1px solid ${editing ? `${colors.red}40` : `${colors.accent}40`}`,
            fontSize: fontSize.sm, fontWeight: 600,
            fontFamily: fonts.body, cursor: 'pointer',
          }}>
            {editing
              ? <><HiOutlineXMark style={{ width: 16, height: 16 }} /> Cancel</>
              : <><HiOutlinePencilSquare style={{ width: 16, height: 16 }} /> Edit Profile</>
            }
          </button>
        </div>
      </motion.div>

      {/* ── Info Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
          <h3 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <HiOutlineUserCircle style={{ width: 20, height: 20, color: colors.accent }} /> Personal Information
          </h3>
          {editing && (
            <div style={{ background: colors.accentGlow, borderRadius: radius.sm, padding: `${spacing.xs} ${spacing.sm}`, marginBottom: spacing.md, fontSize: fontSize.xs, color: colors.accent, fontWeight: 500 }}>
              ✏️ Edit fields below, then click Save
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
            {renderField('Full Name', 'fullName')}
            {renderField('Age', 'age')}
            {renderField('Gender', 'gender')}
            {renderField('Location', 'location')}
            {renderField('Phone', 'phone')}
            {renderField('Email', 'email')}
            {renderField('Address', 'address')}
          </div>
        </motion.div>

        {/* Medical Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={cardStyle}>
          <h3 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <HiOutlineHeart style={{ width: 20, height: 20, color: colors.green }} /> Medical Information
          </h3>
          {editing && (
            <div style={{ background: colors.greenGlow, borderRadius: radius.sm, padding: `${spacing.xs} ${spacing.sm}`, marginBottom: spacing.md, fontSize: fontSize.xs, color: colors.green, fontWeight: 500 }}>
              ✏️ Edit fields below, then click Save
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
            {renderField('Diagnosis', 'diagnosis')}
            {renderField('Medications', 'medications')}
            {renderField('HbA1c', 'hba1c')}
            {renderField('BMI', 'bmi')}
            {renderField('Blood Type', 'bloodType')}
            {renderField('Allergies', 'allergies')}
          </div>
        </motion.div>
      </div>

      {/* ── Medical Records ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <HiOutlineDocumentText style={{ width: 20, height: 20, color: colors.accent }} /> Medical Records
            <span style={{ fontSize: fontSize.xs, fontWeight: 500, color: colors.textSecondary, fontFamily: fonts.body }}>({records.length} files)</span>
          </h3>
          <button onClick={handleUploadClick} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: `8px ${spacing.md}`, borderRadius: radius.sm,
            background: colors.accent, color: '#fff', border: 'none',
            fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <HiOutlineArrowUpTray style={{ width: 14, height: 14 }} /> Upload Record
          </button>
        </div>

        {/* Drop zone hint */}
        <div
          onClick={handleUploadClick}
          style={{
            border: `2px dashed ${colors.border}`, borderRadius: radius.md,
            padding: spacing.lg, textAlign: 'center', marginBottom: spacing.lg,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.background = colors.accentGlow }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent' }}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.background = colors.accentGlow }}
          onDragLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent' }}
          onDrop={(e) => {
            e.preventDefault()
            e.currentTarget.style.borderColor = colors.border
            e.currentTarget.style.background = 'transparent'
            const dt = e.dataTransfer
            if (dt.files.length) handleFileUpload({ target: { files: dt.files, value: '' } })
          }}
        >
          <HiOutlineArrowUpTray style={{ width: 28, height: 28, color: colors.textSecondary, marginBottom: 4 }} />
          <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body }}>
            Click or drag & drop files here
          </p>
          <p style={{ margin: '4px 0 0', fontSize: fontSize.xs, color: `${colors.textSecondary}80` }}>
            Supports PDF, JPG, PNG, DOC • Max 25MB
          </p>
        </div>

        {/* Record list */}
        <AnimatePresence>
          {records.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                display: 'flex', alignItems: 'center', gap: spacing.md,
                padding: `${spacing.md} ${spacing.sm}`,
                borderBottom: i < records.length - 1 ? `1px solid ${colors.border}` : 'none',
                borderRadius: radius.sm, transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.card }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <HiOutlineDocumentText style={{ width: 18, height: 18, color: colors.accent }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary }}>{rec.name}</div>
                <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, display: 'flex', gap: spacing.sm }}>
                  <span>{rec.type}</span> • <span>{rec.size}</span>
                </div>
              </div>
              <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.mono || fonts.body, flexShrink: 0 }}>{rec.date}</span>
              <div style={{ display: 'flex', gap: spacing.xs, flexShrink: 0 }}>
                <button
                  onClick={() => handleViewRecord(rec)}
                  title="View record"
                  style={{
                    width: 30, height: 30, borderRadius: radius.sm,
                    background: colors.accentGlow, color: colors.accent,
                    border: 'none', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}
                >
                  <HiOutlineEye style={{ width: 14, height: 14 }} />
                </button>
                <button
                  onClick={() => handleDeleteRecord(rec.id)}
                  title="Delete record"
                  style={{
                    width: 30, height: 30, borderRadius: radius.sm,
                    background: `${colors.red}18`, color: colors.red,
                    border: 'none', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}
                >
                  <HiOutlineTrash style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* View panel for existing records */}
        <AnimatePresence>
          {viewingRecord && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: spacing.md, background: colors.card,
                border: `1px solid ${colors.accent}40`, borderRadius: radius.md,
                padding: spacing.lg, overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <h4 style={{ margin: 0, fontSize: fontSize.base, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                  📄 {viewingRecord.name}
                </h4>
                <button onClick={() => setViewingRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}>
                  <HiOutlineXMark style={{ width: 18, height: 18 }} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: spacing.md }}>
                <div>
                  <div style={labelStyle}>Type</div>
                  <div style={valueStyle}>{viewingRecord.type}</div>
                </div>
                <div>
                  <div style={labelStyle}>Date</div>
                  <div style={valueStyle}>{viewingRecord.date}</div>
                </div>
                <div>
                  <div style={labelStyle}>Size</div>
                  <div style={valueStyle}>{viewingRecord.size}</div>
                </div>
                <div>
                  <div style={labelStyle}>Status</div>
                  <div style={{ ...valueStyle, color: colors.green, fontWeight: 600 }}>✓ Verified</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Privacy & Consent ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={cardStyle}>
        <h3 style={{ margin: `0 0 ${spacing.md}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <HiOutlineShieldCheck style={{ width: 20, height: 20, color: colors.green }} /> Privacy & Consent
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          {['Data sharing with matched clinical trials', 'AI-based eligibility analysis', 'Notification alerts for new matches'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: colors.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: fonts.body }}>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
