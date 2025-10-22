export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Page not found</p>
      <a 
        href="/" 
        style={{
          marginTop: '2rem',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '500'
        }}
      >
        Go Home
      </a>
    </div>
  );
}

