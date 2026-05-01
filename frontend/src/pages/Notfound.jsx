import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100svh',
            gap: '12px',
            padding: '24px',
            textAlign: 'center',
        }}>
            <span style={{ fontSize: '72px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-2px' }}>
                404
            </span>
            <h1 style={{ margin: 0 }}>Page not found</h1>
            <p style={{ color: 'var(--text)', maxWidth: '340px' }}>
                The page you are looking for does not exist.
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '8px',
                    padding: '10px 24px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#fff',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'opacity 0.15s',
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.85'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
            >
                Go home
            </button>
        </div>
    );
}
