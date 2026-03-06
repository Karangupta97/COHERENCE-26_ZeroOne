import { useState, useEffect } from 'react'

export default function useClinic() {
    const [clinic, setClinic] = useState(() => {
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
                    setClinic(data.user)
                    localStorage.setItem('user', JSON.stringify(data.user))
                }
            })
            .catch(() => { /* keep localStorage fallback */ })
    }, [])

    const clinicName = clinic?.clinicName || `${clinic?.firstName || ''} ${clinic?.lastName || ''}`.trim() || 'Clinic'

    const initials = clinic?.clinicName
        ? clinic.clinicName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        : `${(clinic?.firstName || '')[0] || ''}${(clinic?.lastName || '')[0] || ''}`.toUpperCase() || 'CL'

    const location = [clinic?.city, clinic?.state].filter(Boolean).join(', ') || ''

    return { clinic, clinicName, initials, location }
}
