import { useTheme, radius, spacing, fontSize, TRIALS } from '../../theme.jsx'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const TRIAL_LOCATIONS = [
  { name: 'GLYCO-ADVANCE',  lat: 19.0760, lng: 72.8777, sponsor: 'Novo Nordisk',   score: 94 },
  { name: 'CARDIO-PROTECT', lat: 18.5204, lng: 73.8567, sponsor: 'AstraZeneca',     score: 81 },
  { name: 'META-RESET',     lat: 19.0330, lng: 73.0297, sponsor: 'Sun Pharma',      score: 73 },
  { name: 'NEURO-SHIELD',   lat: 19.1136, lng: 72.8697, sponsor: 'Cipla Research',  score: 68 },
  { name: 'ONCO-TARGET',    lat: 19.0048, lng: 72.8432, sponsor: 'Tata Memorial',   score: 88 },
]

export default function NearbyTrialsMap() {
  const { colors, fonts } = useTheme()

  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.lg,
      boxShadow: colors.shadow,
      padding: spacing.lg,
      overflow: 'hidden',
    }}>
      <h2 style={{ margin: `0 0 ${spacing.md}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        📍 Nearby Clinical Trials
      </h2>

      <div style={{ borderRadius: radius.md, overflow: 'hidden', height: 280 }}>
        <MapContainer center={[19.0760, 72.8777]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {TRIAL_LOCATIONS.map((loc) => (
            <Marker key={loc.name} position={[loc.lat, loc.lng]}>
              <Popup>
                <div style={{ fontFamily: fonts.body }}>
                  <strong>{loc.name}</strong><br />
                  {loc.sponsor}<br />
                  Match: {loc.score}%
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
