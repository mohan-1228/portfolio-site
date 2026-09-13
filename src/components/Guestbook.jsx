import { useEffect, useState } from 'react';

const API_URL = 'https://ivsuxz3r2fferiqson4gipokyy.appsync-api.us-east-1.amazonaws.com/graphql';
const API_KEY = 'da2-77opzohqpnfpvkerckngumjtn4';

async function gqlRequest(query, variables) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(json.errors[0].message || 'Request failed');
  }
  return json.data;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function Guestbook() {
  // "state" in React just means: values that, when changed, trigger the UI to re-render automatically.
  // Compare this to the old vanilla version, where WE had to manually call renderGuestbook() every time
  // data changed. Here, updating state IS the re-render trigger — React handles the "redraw" part for us.
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });

  // useEffect with an empty [] dependency array means:
  // "run this once, right after the component first appears on screen" — equivalent to
  // our old loadGuestbook() call at the bottom of the vanilla script.
  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const data = await gqlRequest(`
        query ListGuestbookEntries {
          listGuestbookEntries { items { id name message createdAt } }
        }
      `);
      const sorted = [...data.listGuestbookEntries.items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setEntries(sorted);
    } catch (err) {
      console.error('Guestbook load failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setStatus({ text: '', type: '' });
    try {
      const data = await gqlRequest(`
        mutation CreateGuestbookEntry($input: CreateGuestbookEntryInput!) {
          createGuestbookEntry(input: $input) { id name message createdAt }
        }
      `, { input: { name: name.trim(), message: message.trim() } });

      setEntries(prev => [data.createGuestbookEntry, ...prev]);
      setStatus({ text: 'Signed — thanks!', type: 'ok' });
      setName('');
      setMessage('');
    } catch (err) {
      console.error('Guestbook submit failed:', err);
      setStatus({ text: 'Something went wrong — try again.', type: 'err' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="guestbook" id="guestbook">
      <div className="wrap">
        <div className="gb-head">
          <div className="section-label">05 — Guestbook</div>
          <h2 className="section-title">Leave a signal.</h2>
        </div>
        <div className="gb-grid">
          <form className="gb-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="gb-name">Name</label>
              <input
                id="gb-name"
                type="text"
                placeholder="Your name"
                required
                maxLength={80}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="gb-message">Message</label>
              <textarea
                id="gb-message"
                placeholder="Say something"
                required
                maxLength={500}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <button className="submit-btn" type="submit" disabled={submitting}>
              {submitting ? 'Signing…' : 'Sign the guestbook'}
            </button>
            <div className={`form-status ${status.type}`}>{status.text}</div>
          </form>

          <div className="gb-list">
            {loading && <div className="gb-empty">Loading entries…</div>}
            {!loading && entries.length === 0 && (
              <div className="gb-empty">No entries yet — be the first to sign.</div>
            )}
            {!loading && entries.map(entry => (
              <div className="gb-entry" key={entry.id}>
                <div className="gb-entry-top">
                  <div className="gb-entry-name">{entry.name}</div>
                  <div className="gb-entry-date">{formatDate(entry.createdAt)}</div>
                </div>
                <div className="gb-entry-msg">{entry.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Guestbook;