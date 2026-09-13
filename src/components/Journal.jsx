import { useEffect, useState } from 'react';

const API_URL = 'https://ur46n7cizfhn7pnk3t5rbkkm24.appsync-api.us-east-1.amazonaws.com/graphql';
const API_KEY = 'da2-ncfm2tsouvfjfkvvpakgbbvvay';

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadPublicEntries();
  }, []);

  async function loadPublicEntries() {
    try {
      const data = await gqlRequest(`
        query ListPublicJournalEntries {
          listPublicJournalEntries { id title date content }
        }
      `);
      const sorted = [...data.listPublicJournalEntries].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEntries(sorted);
    } catch (err) {
      console.error('Journal load failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="journal" id="journal">
      <div className="wrap">
        <div className="journal-head">
          <div className="section-label">07 — Journal</div>
          <h2 className="section-title">Notes, out loud.</h2>
        </div>

        {loading && <div className="journal-empty">Loading entries…</div>}
        {!loading && entries.length === 0 && (
          <div className="journal-empty">Nothing public yet — check back soon.</div>
        )}

        <div className="journal-list">
          {entries.map(entry => {
            const isOpen = expandedId === entry.id;
            return (
              <div className="journal-entry" key={entry.id}>
                <button
                  className="journal-entry-header"
                  onClick={() => setExpandedId(isOpen ? null : entry.id)}
                >
                  <span className="journal-entry-date">{formatDate(entry.date)}</span>
                  <span className="journal-entry-title">{entry.title}</span>
                  <span className="journal-entry-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div
                    className="journal-entry-content"
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Journal;