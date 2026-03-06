import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlineDocumentText,
    HiOutlineArrowUpTray,
    HiOutlineMagnifyingGlass,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
    HiOutlineXMark,
    HiOutlineSparkles,
    HiOutlineDocumentArrowUp,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineBeaker,
    HiOutlineClipboardDocumentList,
    HiOutlineArchiveBox,
    HiOutlineChevronDown,
    HiOutlineFolderOpen,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
} from 'react-icons/hi2'

const CATEGORIES = ['All Reports', 'Medical Report', 'Lab Result', 'Prescription']
const CATEGORY_ICONS = {
    'Medical Report': HiOutlineDocumentText,
    'Lab Result': HiOutlineBeaker,
    'Prescription': HiOutlineClipboardDocumentList,
}

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

function getMimeIcon(mimeType) {
    if (mimeType === 'application/pdf') return { bg: '#EF444420', color: '#EF4444', label: 'PDF' }
    if (mimeType === 'image/png') return { bg: '#3B82F620', color: '#3B82F6', label: 'PNG' }
    if (mimeType === 'image/jpeg') return { bg: '#F59E0B20', color: '#F59E0B', label: 'JPG' }
    return { bg: '#6B728020', color: '#6B7280', label: 'FILE' }
}

function formatFileSize(bytes) {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/* ═══════════════════════════════════════════════ */
/*  Upload Modal                                  */
/* ═══════════════════════════════════════════════ */
function UploadModal({ open, onClose, onUploadSuccess, colors, fonts }) {
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Medical Report')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState('')
    const inputRef = useRef(null)

    const reset = () => { setFile(null); setTitle(''); setCategory('Medical Report'); setDescription(''); setError(''); }
    const handleClose = () => { reset(); onClose(); }

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragOver(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped) { setFile(dropped); if (!title) setTitle(dropped.name.replace(/\.[^.]+$/, '')); }
    }, [title])

    const handleFileSelect = (e) => {
        const selected = e.target.files[0]
        if (selected) { setFile(selected); if (!title) setTitle(selected.name.replace(/\.[^.]+$/, '')); }
    }

    const handleUpload = async () => {
        if (!file) { setError('Please select a file'); return }
        if (!title.trim()) { setError('Please enter a title'); return }
        setError(''); setUploading(true)
        try {
            const formData = new FormData()
            formData.append('report', file)
            formData.append('title', title)
            formData.append('category', category)
            formData.append('description', description)
            const token = localStorage.getItem('token')
            const res = await fetch('/api/reports/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Upload failed')
            onUploadSuccess(data.data)
            handleClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    if (!open) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                        width: '100%', maxWidth: 520, background: colors.surface,
                        borderRadius: '20px', border: `1px solid ${colors.border}`,
                        boxShadow: `0 24px 60px rgba(0,0,0,0.3)`, overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '20px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                Upload New Report
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                Add your medical documents, images, or PDFs
                            </p>
                        </div>
                        <button onClick={handleClose} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: colors.textSecondary, padding: 4,
                        }}>
                            <HiOutlineXMark style={{ width: 20, height: 20 }} />
                        </button>
                    </div>

                    <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Drop zone */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>Upload File</span>
                                <span style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>Max size: 5MB</span>
                            </div>
                            <div
                                onClick={() => inputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                style={{
                                    border: `2px dashed ${dragOver ? colors.accent : colors.border}`,
                                    borderRadius: '14px', padding: '32px 20px',
                                    textAlign: 'center', cursor: 'pointer',
                                    background: dragOver ? `${colors.accent}08` : colors.card,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFileSelect} />
                                {file ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                        <HiOutlineCheckCircle style={{ width: 20, height: 20, color: colors.green }} />
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{file.name}</span>
                                        <span style={{ fontSize: '11px', color: colors.textSecondary }}>({formatFileSize(file.size)})</span>
                                    </div>
                                ) : (
                                    <>
                                        <HiOutlineDocumentArrowUp style={{ width: 28, height: 28, color: colors.accent, margin: '0 auto 8px' }} />
                                        <p style={{ margin: 0, fontSize: '13px', color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                                            Drag and drop your file here
                                        </p>
                                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                            or click to browse
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body, display: 'block', marginBottom: 6 }}>
                                Report Title <span style={{ color: colors.red || '#EF4444' }}>*</span>
                            </label>
                            <input value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="Enter a title for your report"
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                                    border: `1.5px solid ${colors.border}`, background: colors.card,
                                    color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = colors.accent}
                                onBlur={e => e.target.style.borderColor = colors.border}
                            />
                        </div>

                        {/* Category + Description row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body, display: 'block', marginBottom: 6 }}>Category</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={category} onChange={e => setCategory(e.target.value)}
                                        style={{
                                            width: '100%', padding: '10px 32px 10px 14px', borderRadius: '10px',
                                            border: `1.5px solid ${colors.border}`, background: colors.card,
                                            color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                                            outline: 'none', cursor: 'pointer', appearance: 'none',
                                            boxSizing: 'border-box',
                                        }}>
                                        <option value="Medical Report">Medical Report</option>
                                        <option value="Lab Result">Lab Result</option>
                                        <option value="Prescription">Prescription</option>
                                    </select>
                                    <HiOutlineChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: colors.textSecondary, pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body, display: 'block', marginBottom: 6 }}>Description</label>
                                <input value={description} onChange={e => setDescription(e.target.value)}
                                    placeholder="Brief description…"
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                                        border: `1.5px solid ${colors.border}`, background: colors.card,
                                        color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                                        outline: 'none', boxSizing: 'border-box',
                                    }}
                                    onFocus={e => e.target.style.borderColor = colors.accent}
                                    onBlur={e => e.target.style.borderColor = colors.border}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: colors.red || '#EF4444', fontFamily: fonts.body }}>
                                <HiOutlineExclamationTriangle style={{ width: 14, height: 14 }} /> {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                            <button onClick={handleClose} style={{
                                padding: '10px 22px', borderRadius: '10px',
                                background: 'transparent', color: colors.textSecondary,
                                border: `1px solid ${colors.border}`, fontSize: '13px',
                                fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={handleUpload} disabled={uploading} style={{
                                padding: '10px 22px', borderRadius: '10px',
                                background: colors.accent, color: '#fff',
                                border: 'none', fontSize: '13px',
                                fontWeight: 600, fontFamily: fonts.body, cursor: uploading ? 'wait' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                opacity: uploading ? 0.7 : 1,
                            }}>
                                <HiOutlineArrowUpTray style={{ width: 14, height: 14 }} />
                                {uploading ? 'Uploading…' : 'Upload Report'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

/* ═══════════════════════════════════════════════ */
/*  Analyze Modal                                 */
/* ═══════════════════════════════════════════════ */
function AnalyzeModal({ report, open, onClose, colors, fonts }) {
    if (!open || !report) return null
    const data = report.extractedData
    const failed = report.extractionStatus === 'failed'

    const pill = (label) => (
        <span key={label} style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
            background: colors.accentGlow, color: colors.accent,
            fontFamily: fonts.body, fontWeight: 500,
        }}>{label}</span>
    )

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 560, maxHeight: '80vh', overflow: 'auto',
                    background: colors.surface, borderRadius: '20px',
                    border: `1px solid ${colors.border}`, boxShadow: `0 24px 60px rgba(0,0,0,0.3)`,
                    padding: '28px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${colors.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HiOutlineSparkles style={{ width: 18, height: 18, color: colors.accent }} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>AI Analysis</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}>
                        <HiOutlineXMark style={{ width: 20, height: 20 }} />
                    </button>
                </div>

                <div style={{ padding: '14px 16px', borderRadius: '12px', background: colors.card, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{report.originalFileName}</span>
                    <span style={{ fontSize: '11px', color: colors.textSecondary, marginLeft: 8 }}>
                        {report.extractionStatus === 'success' ? '✓ Analyzed' : '— Analysis pending'}
                    </span>
                </div>

                {failed ? (
                    <div style={{ textAlign: 'center', padding: 32, color: colors.textSecondary, fontFamily: fonts.body, fontSize: '13px' }}>
                        <HiOutlineExclamationTriangle style={{ width: 32, height: 32, color: colors.yellow || '#F59E0B', margin: '0 auto 10px' }} />
                        <p>AI extraction failed for this report.</p>
                        <p style={{ fontSize: '11px', opacity: 0.7 }}>{report.extractionError}</p>
                    </div>
                ) : !data ? (
                    <div style={{ textAlign: 'center', padding: 32, color: colors.textSecondary, fontFamily: fonts.body, fontSize: '13px' }}>
                        No extracted data available yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Demographics */}
                        {(data.age || data.gender) && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {data.age && <div style={{ padding: '12px 16px', borderRadius: '12px', background: colors.card, border: `1px solid ${colors.border}` }}>
                                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 4, letterSpacing: '0.5px' }}>Age</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>{data.age}</div>
                                </div>}
                                {data.gender && <div style={{ padding: '12px 16px', borderRadius: '12px', background: colors.card, border: `1px solid ${colors.border}` }}>
                                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 4, letterSpacing: '0.5px' }}>Gender</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>{data.gender}</div>
                                </div>}
                            </div>
                        )}

                        {/* Diagnosis */}
                        {data.diagnosis?.length > 0 && (
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 6, letterSpacing: '0.5px' }}>Diagnosis</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{data.diagnosis.map(pill)}</div>
                            </div>
                        )}

                        {/* Symptoms */}
                        {data.symptoms?.length > 0 && (
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 6, letterSpacing: '0.5px' }}>Symptoms</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{data.symptoms.map(pill)}</div>
                            </div>
                        )}

                        {/* Lab Results */}
                        {data.lab_results && Object.values(data.lab_results).some(v => v) && (
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 6, letterSpacing: '0.5px' }}>Lab Results</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {Object.entries(data.lab_results).filter(([, v]) => v).map(([key, val]) => (
                                        <div key={key} style={{ padding: '10px 14px', borderRadius: '10px', background: colors.card, border: `1px solid ${colors.border}` }}>
                                            <div style={{ fontSize: '10px', color: colors.textSecondary, fontFamily: fonts.body, textTransform: 'capitalize', marginBottom: 2 }}>{key.replace('_', ' ')}</div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: colors.green, fontFamily: fonts.heading }}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Medications */}
                        {data.medications?.length > 0 && (
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 6, letterSpacing: '0.5px' }}>Medications</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{data.medications.map(pill)}</div>
                            </div>
                        )}

                        {/* Medical History */}
                        {data.medical_history?.length > 0 && (
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 6, letterSpacing: '0.5px' }}>Medical History</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{data.medical_history.map(pill)}</div>
                            </div>
                        )}

                        {/* Recommended Specialist */}
                        {data.recommended_specialist && (
                            <div style={{ padding: '12px 16px', borderRadius: '12px', background: `${colors.green}12`, border: `1px solid ${colors.green}30` }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 4, letterSpacing: '0.5px' }}>Recommended Specialist</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.green, fontFamily: fonts.heading }}>{data.recommended_specialist}</div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

/* ═══════════════════════════════════════════════ */
/*  Main Reports Page                             */
/* ═══════════════════════════════════════════════ */
export default function PatientReports() {
    const { colors, fonts } = useTheme()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All Reports')
    const [viewMode, setViewMode] = useState('grid')
    const [showUpload, setShowUpload] = useState(false)
    const [analyzeReport, setAnalyzeReport] = useState(null)
    const [hoveredCard, setHoveredCard] = useState(null)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/reports/my', {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const data = await res.json()
            if (data.ok) setReports(data.data || [])
        } catch (err) {
            console.error('Failed to fetch reports', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadSuccess = (newReport) => {
        setReports(prev => [newReport, ...prev])
    }

    const filtered = reports.filter(r => {
        const matchSearch = !search || r.originalFileName?.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All Reports' || r.mimeType?.includes(category === 'Lab Result' ? 'image' : 'pdf')
        return matchSearch && matchCat
    })

    const totalSize = reports.reduce((sum, r) => sum + (r.fileSize || 0), 0)
    const pdfCount = reports.filter(r => r.mimeType === 'application/pdf').length
    const imgCount = reports.filter(r => r.mimeType?.startsWith('image/')).length

    const card = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: colors.shadow,
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 1400 }}>

            {/* ── Page Header ── */}
            <motion.div {...fadeUp} transition={{ duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: colors.accentGlow,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <HiOutlineFolderOpen style={{ width: 24, height: 24, color: colors.accent }} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', fontFamily: fonts.heading, fontWeight: 800, color: colors.textPrimary }}>
                            Medical Reports
                        </h1>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                            Manage and organize your medical documents with ease
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowUpload(true)}
                    style={{
                        padding: '12px 24px', borderRadius: '12px',
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent}CC)`,
                        color: '#fff', border: 'none', fontSize: '13px',
                        fontWeight: 700, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: `0 4px 16px ${colors.accent}30`,
                    }}
                >
                    <HiOutlineArrowUpTray style={{ width: 16, height: 16 }} /> Upload New Report
                </motion.button>
            </motion.div>

            {/* ── Meta line ── */}
            <div style={{ display: 'flex', gap: 16, fontSize: '12px', fontFamily: fonts.body }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.accent }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent }} /> {reports.length} Total Files
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.green }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.green }} /> {formatFileSize(totalSize)} Used
                </span>
            </div>

            {/* ── Search + Filter Bar ── */}
            <motion.div {...fadeUp} transition={{ delay: 0.05 }}
                style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                    <HiOutlineMagnifyingGlass style={{
                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                        width: 16, height: 16, color: colors.textSecondary, pointerEvents: 'none',
                    }} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search reports…"
                        style={{
                            width: '100%', padding: '11px 16px 11px 40px', borderRadius: '12px',
                            border: `1.5px solid ${colors.border}`, background: colors.surface,
                            color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                            outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = colors.accent}
                        onBlur={e => e.target.style.borderColor = colors.border}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                        style={{
                            padding: '11px 34px 11px 14px', borderRadius: '12px',
                            border: `1.5px solid ${colors.border}`, background: colors.surface,
                            color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                            outline: 'none', cursor: 'pointer', appearance: 'none',
                        }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <HiOutlineChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: colors.textSecondary, pointerEvents: 'none' }} />
                </div>

                <div style={{
                    display: 'flex', border: `1.5px solid ${colors.border}`,
                    borderRadius: '10px', overflow: 'hidden',
                }}>
                    <button onClick={() => setViewMode('grid')} style={{
                        padding: '8px 14px', border: 'none', cursor: 'pointer',
                        background: viewMode === 'grid' ? colors.accent : colors.surface,
                        color: viewMode === 'grid' ? '#fff' : colors.textSecondary,
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px',
                        fontFamily: fonts.body, fontWeight: 600,
                    }}>
                        <HiOutlineSquares2X2 style={{ width: 14, height: 14 }} /> Grid
                    </button>
                    <button onClick={() => setViewMode('list')} style={{
                        padding: '8px 14px', border: 'none', cursor: 'pointer',
                        background: viewMode === 'list' ? colors.accent : colors.surface,
                        color: viewMode === 'list' ? '#fff' : colors.textSecondary,
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px',
                        fontFamily: fonts.body, fontWeight: 600,
                        borderLeft: `1px solid ${colors.border}`,
                    }}>
                        <HiOutlineListBullet style={{ width: 14, height: 14 }} /> List
                    </button>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                    { label: 'Medical Reports', count: pdfCount, sub: 'Medical documents', Icon: HiOutlineDocumentText, color: colors.accent },
                    { label: 'Lab Results', count: imgCount, sub: 'Test results', Icon: HiOutlineBeaker, color: colors.green },
                    { label: 'Prescriptions', count: reports.length - pdfCount - imgCount, sub: 'Medications', Icon: HiOutlineClipboardDocumentList, color: '#8B5CF6' },
                    { label: 'Storage Used', count: null, sub: `${((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1)}% used`, Icon: HiOutlineArchiveBox, color: '#F59E0B' },
                ].map((s, i) => (
                    <div key={i} style={{ ...card, padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <span style={{ fontSize: '12px', color: s.color, fontFamily: fonts.body, fontWeight: 600 }}>{s.label}</span>
                            <div style={{
                                width: 32, height: 32, borderRadius: '8px',
                                background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <s.Icon style={{ width: 16, height: 16, color: s.color }} />
                            </div>
                        </div>
                        {s.count !== null ? (
                            <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1 }}>
                                {s.count}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                <span style={{ fontSize: '26px', fontWeight: 800, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1 }}>
                                    {((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1)}%
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: 500, color: colors.textSecondary }}>
                                    ({formatFileSize(totalSize)} / 5 MB)
                                </span>
                            </div>
                        )}
                        <div style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body, marginTop: 4 }}>{s.sub}</div>
                        {s.label === 'Storage Used' && (
                            <div style={{ height: 4, borderRadius: 2, background: colors.border, marginTop: 8 }}>
                                <div style={{ height: '100%', borderRadius: 2, background: s.color, width: `${Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100)}%`, transition: 'width 0.3s' }} />
                            </div>
                        )}
                    </div>
                ))}
            </motion.div>

            {/* ── Results line ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', fontFamily: fonts.body, color: colors.textSecondary }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent }} />
                    Showing: <strong style={{ color: colors.textPrimary }}>{category}</strong>
                </div>
                <span style={{ fontSize: '12px', fontFamily: fonts.body, color: colors.textSecondary }}>
                    {filtered.length} results found <span style={{ color: colors.green }}>●</span>
                </span>
            </div>

            {/* ── Reports Grid / List ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: colors.textSecondary, fontFamily: fonts.body, fontSize: '14px' }}>
                    Loading reports…
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, ...card }}>
                    <HiOutlineFolderOpen style={{ width: 40, height: 40, color: colors.textSecondary, margin: '0 auto 12px' }} />
                    <p style={{ color: colors.textSecondary, fontFamily: fonts.body, fontSize: '14px', margin: 0 }}>
                        {reports.length === 0 ? 'No reports uploaded yet. Click "Upload New Report" to get started.' : 'No reports match your search.'}
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {filtered.map((report, i) => {
                        const mime = getMimeIcon(report.mimeType)
                        const isImage = report.mimeType?.startsWith('image/')
                        return (
                            <motion.div key={report._id}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onMouseEnter={() => setHoveredCard(report._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    ...card, overflow: 'hidden',
                                    transition: 'all 0.25s ease',
                                    borderColor: hoveredCard === report._id ? `${colors.accent}50` : colors.border,
                                    transform: hoveredCard === report._id ? 'translateY(-3px)' : 'none',
                                    boxShadow: hoveredCard === report._id ? `0 8px 28px ${colors.accent}12` : colors.shadow,
                                }}
                            >
                                {/* Category tag */}
                                <div style={{ padding: '10px 14px 0', display: 'flex', gap: 6 }}>
                                    <span style={{
                                        padding: '2px 10px', borderRadius: '6px', fontSize: '10px',
                                        fontFamily: fonts.body, fontWeight: 600,
                                        background: mime.bg, color: mime.color,
                                    }}>{mime.label}</span>
                                </div>

                                {/* Thumbnail area */}
                                <div style={{
                                    height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '16px',
                                }}>
                                    {isImage && report.reportUrl ? (
                                        <img src={report.reportUrl} alt={report.originalFileName}
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                                    ) : (
                                        <div style={{
                                            width: 56, height: 64, borderRadius: '8px',
                                            background: mime.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <HiOutlineDocumentText style={{ width: 28, height: 28, color: mime.color }} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: '0 14px 14px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {report.originalFileName}
                                    </div>
                                    <div style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 8 }}>
                                        Uploaded on {formatDate(report.createdAt)}
                                    </div>

                                    {/* Analyze button */}
                                    <button onClick={() => setAnalyzeReport(report)}
                                        style={{
                                            width: '100%', padding: '8px', borderRadius: '8px',
                                            background: colors.accentGlow, color: colors.accent,
                                            border: `1px solid ${colors.accent}30`, fontSize: '11px',
                                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = colors.accent; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = colors.accentGlow; e.currentTarget.style.color = colors.accent; }}
                                    >
                                        <HiOutlineSparkles style={{ width: 13, height: 13 }} /> Analyze
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                /* ── List view ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.map((report, i) => {
                        const mime = getMimeIcon(report.mimeType)
                        return (
                            <motion.div key={report._id}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onMouseEnter={() => setHoveredCard(report._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    ...card, padding: '14px 20px',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    transition: 'all 0.25s ease',
                                    borderColor: hoveredCard === report._id ? `${colors.accent}50` : colors.border,
                                    transform: hoveredCard === report._id ? 'translateY(-1px)' : 'none',
                                }}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: '10px',
                                    background: mime.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <HiOutlineDocumentText style={{ width: 20, height: 20, color: mime.color }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {report.originalFileName}
                                    </div>
                                    <div style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                        {formatDate(report.createdAt)} · {mime.label}
                                    </div>
                                </div>
                                <span style={{
                                    padding: '3px 10px', borderRadius: '6px', fontSize: '10px',
                                    background: report.extractionStatus === 'success' ? colors.greenGlow : `${colors.yellow || '#F59E0B'}15`,
                                    color: report.extractionStatus === 'success' ? colors.green : (colors.yellow || '#F59E0B'),
                                    fontFamily: fonts.body, fontWeight: 600,
                                }}>
                                    {report.extractionStatus === 'success' ? 'Analyzed' : report.extractionStatus === 'pending' ? 'Pending' : 'Failed'}
                                </span>
                                <button onClick={() => setAnalyzeReport(report)}
                                    style={{
                                        padding: '7px 16px', borderRadius: '8px',
                                        background: colors.accentGlow, color: colors.accent,
                                        border: `1px solid ${colors.accent}30`, fontSize: '11px',
                                        fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        transition: 'all 0.2s', flexShrink: 0,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = colors.accent; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = colors.accentGlow; e.currentTarget.style.color = colors.accent; }}
                                >
                                    <HiOutlineSparkles style={{ width: 12, height: 12 }} /> Analyze
                                </button>
                                {report.reportUrl && (
                                    <a href={report.reportUrl} target="_blank" rel="noopener noreferrer"
                                        style={{
                                            padding: '7px 12px', borderRadius: '8px',
                                            background: 'transparent', color: colors.textSecondary,
                                            border: `1px solid ${colors.border}`, fontSize: '11px',
                                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0,
                                        }}
                                    >
                                        <HiOutlineEye style={{ width: 12, height: 12 }} /> View
                                    </a>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* Modals */}
            <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onUploadSuccess={handleUploadSuccess} colors={colors} fonts={fonts} />
            <AnalyzeModal report={analyzeReport} open={!!analyzeReport} onClose={() => setAnalyzeReport(null)} colors={colors} fonts={fonts} />
        </div>
    )
}
