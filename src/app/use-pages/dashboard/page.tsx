export default function BasicDashboard() {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard.html';
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Redirecting to Dashboard...
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          If you are not redirected automatically,
          <a href="/dashboard.html" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            click here
          </a>
        </p>
        <div style={{ fontSize: '2rem' }}>⏳</div>
      </div>
    </div>
  );
}
