export default function LandingPage() {
    return (
        <div style={{ padding: '48px', textAlign: 'center' }}>
            <h1>TrialMatch AI</h1>
            <p>Welcome to the AI-Powered Clinical Trial Matching Platform</p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <a href="/clinic" style={{ padding: '12px 24px', background: '#818CF8', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                    Clinic Portal →
                </a>
            </div>
        </div>
    );
}
