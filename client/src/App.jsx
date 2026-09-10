import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Clipboard, Link2, Sparkles } from 'lucide-react';

const apiOrigin = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'https://url-shortner-alpha-topaz.vercel.app' : window.location.origin);
const apiUrl = (path) => `${apiOrigin}${path}`;
const getShortUrl = (shortCode) => `${apiOrigin}/${shortCode}`;

function App() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(apiUrl('/api/links'))
      .then((response) => response.ok ? response.json() : [])
      .then(setLinks)
      .catch(() => setLinks([]));
  }, []);

  const shortenUrl = async (event) => {
    event.preventDefault();
    setError('');
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/links'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setCreatedLink(data);
      setLinks((currentLinks) => [data, ...currentLinks.filter((link) => link._id !== data._id)].slice(0, 8));
      setUrl('');
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (shortCode) => {
    await navigator.clipboard.writeText(getShortUrl(shortCode));
    setCopied(shortCode);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="shell">
      <nav className="topbar">
        <a className="brand" href="/" aria-label="Briefly home">
          <span className="brand-mark"><Link2 size={17} strokeWidth={2.4} /></span>
          briefly<span className="brand-dot">.</span>
        </a>
        <span className="status"><span className="status-dot" /> Simple links, made lighter</span>
      </nav>

      <section className="hero">
        <div className="eyebrow"><Sparkles size={14} /> Make it brief</div>
        <h1>Long links have<br /><em>better things</em> to do.</h1>
        <p className="intro">Turn unwieldy URLs into neat, shareable links in a blink. No account, no fuss.</p>

        <form className="shorten-form" onSubmit={shortenUrl}>
          <div className="input-wrap">
            <Link2 size={19} aria-hidden="true" />
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste your long URL here..."
              aria-label="Long URL"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten URL'}
            {!loading && <ArrowUpRight size={17} />}
          </button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}

        {createdLink && (
          <div className="result" aria-live="polite">
            <div>
              <span className="result-label">Your short link is ready</span>
              <a href={`/${createdLink.shortCode}`} target="_blank" rel="noreferrer">{getShortUrl(createdLink.shortCode)}</a>
            </div>
            <button className="copy-button" onClick={() => copyLink(createdLink.shortCode)} aria-label="Copy short link">
              {copied === createdLink.shortCode ? <Check size={18} /> : <Clipboard size={18} />}
              <span>{copied === createdLink.shortCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </section>

      <section className="recent" aria-labelledby="recent-heading">
        <div className="section-heading">
          <div><span className="section-kicker">Your collection</span><h2 id="recent-heading">Recently shortened</h2></div>
          <span className="link-count">{links.length} links</span>
        </div>
        {links.length > 0 ? (
          <div className="link-list">
            {links.map((link) => (
              <article className="link-row" key={link._id}>
                <div className="link-icon"><Link2 size={17} /></div>
                <div className="link-details"><a href={`/${link.shortCode}`}>{getShortUrl(link.shortCode)}</a><span>{link.originalUrl}</span></div>
                <span className="clicks">{link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}</span>
                <button className="icon-button" onClick={() => copyLink(link.shortCode)} aria-label={`Copy ${link.shortCode}`} title="Copy link">
                  {copied === link.shortCode ? <Check size={17} /> : <Clipboard size={17} />}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">Your shortened links will appear here.</div>
        )}
      </section>

      <footer><span>BRIEFLY / 2026</span><span>Fast, focused, shareable.</span></footer>
    </main>
  );
}

export default App;