import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './hellojobs.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px', fontFamily: 'sans-serif', background: '#fff',
          minHeight: '100dvh', boxSizing: 'border-box'
        }}>
          <h2 style={{ color: '#c0392b', marginBottom: 12 }}>렌더링 오류</h2>
          <pre style={{
            background: '#fff5f5', border: '1px solid #fecdca',
            padding: '16px', borderRadius: '8px', fontSize: '13px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#7f1d1d'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
