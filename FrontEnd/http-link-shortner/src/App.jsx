import { useState } from 'react';
import './App.css';

const API_BASE = 'http://localhost:3000'; // Adjust if backend runs elsewhere

function App() {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const body = { url };
      if (validity) body.validity = parseInt(validity);
      if (shortcode) body.shortcode = shortcode;
      const res = await fetch(`${API_BASE}/shorturis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unknown error');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shortener-container">
      <h1>URL Shortener</h1>
      <form className="shortener-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter long URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Validity (minutes, default 30)"
          value={validity}
          onChange={e => setValidity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={e => setShortcode(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <div>Short URL: <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">{result.shortUrl}</a></div>
          <div>Expires At: {new Date(result.expiresAt).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
