import { useState, useEffect } from 'react'

export default function useDoctor() {
    const [doctor, setDoctor] = useState(() => {
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
                    setDoctor(data.user)
                    localStorage.setItem('user', JSON.stringify(data.user))
                }
            })
            .catch(() => { /* keep localStorage fallback */ })
    }, [])

    const fullName = doctor
        ? `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim()
        : 'Doctor'

    const initials = doctor
        ? `${(doctor.firstName || '')[0] || ''}${(doctor.lastName || '')[0] || ''}`.toUpperCase()
        : 'DR'

    return { doctor, fullName, initials }
}
