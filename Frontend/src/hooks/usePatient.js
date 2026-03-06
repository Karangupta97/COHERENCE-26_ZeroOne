import { useState, useEffect } from 'react'

export default function usePatient() {
    const [patient, setPatient] = useState(() => {
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        fetch('/api/profile/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                if (data.ok && data.user) {
                    setPatient(data.user)
                    localStorage.setItem('user', JSON.stringify(data.user))
                }
            })
            .catch(() => { /* keep localStorage fallback */ })
    }, [])

    const fullName = patient
        ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
        : 'Patient'

    const firstName = patient?.firstName || 'Patient'

    const initials = patient
        ? `${(patient.firstName || '')[0] || ''}${(patient.lastName || '')[0] || ''}`.toUpperCase()
        : 'PT'

    const anonymizedId = patient?.anonymizedId || 'ANON-XXXXXXXX'

    return { patient, fullName, firstName, initials, anonymizedId }
}
