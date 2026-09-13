import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

function AdminApp() {
  const [configReady, setConfigReady] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [form, setForm] = useState({ title: '', date: '', content: '', isPublic: false });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load backend config at runtime (works in any environment — local, sandbox, or production)
  // and only THEN create the data client, since it needs Amplify.configure() to have run first.
  useEffect(() => {
    fetch('/amplify_outputs.json')
      .then(res => res.json())
      .then(outputs => {
        Amplify.configure(outputs);
        window.__journalClient = generateClient({ authMode: 'userPool' });
        setConfigReady(true);
      });
  }, []);

  useEffect(() => {
    if (configReady) checkSession();
  }, [configReady]);

  useEffect(() => {
    if (user) loadEntries();
  }, [user]);

  async function checkSession() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setCheckingSession(false);
    }
  }

  async function loadEntries() {
    setLoadingEntries(true);
    try {
      const { data } = await window.__journalClient.models.JournalEntry.list();
      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setEntries(sorted);
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      await signIn({ username: email, password });
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Login failed — check your email and password.');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await signOut();
    setUser(null);
    setEntries([]);
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setForm({ title: entry.title, date: entry.date, content: entry.content, isPublic: entry.isPublic });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ title: '', date: '', content: '', isPublic: false });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.content.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await window.__journalClient.models.JournalEntry.update({ id: editingId, ...form });
      } else {
        await window.__journalClient.models.JournalEntry.create(form);
      }
      resetForm();
      await loadEntries();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this entry permanently?')) return;
    try {
      await window.__journalClient.models.JournalEntry.delete({ id });
      await loadEntries();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  if (!configReady) {
    return <div className="admin-loading">Loading configuration…</div>;
  }

  if (checkingSession) {
    return <div className="admin-loading">Checking session…</div>;
  }

  if (!user) {
    return (
      <div className="admin-login-screen">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h1>Journal Admin</h1>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {loginError && <div className="admin-error">{loginError}</div>}
          <button className="submit-btn" type="submit" disabled={loggingIn}>
            {loggingIn ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <span>Logged in as {user.signInDetails?.loginId || user.username}</span>
        <button className="admin-logout-btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="admin-content">
        <form className="admin-editor" onSubmit={handleSave}>
          <h2>{editingId ? 'Edit entry' : 'New entry'}</h2>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" type="text" required value={form.title} onChange={e => updateField('title', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" required value={form.date} onChange={e => updateField('date', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="content">Content (basic HTML allowed — &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;&lt;li&gt;)</label>
            <textarea
              id="content" required rows={8}
              value={form.content} onChange={e => updateField('content', e.target.value)}
            />
          </div>
          <div className="admin-toggle-row">
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={e => updateField('isPublic', e.target.checked)}
              />
              <span className="admin-toggle-track"></span>
              <span className="admin-toggle-thumb"></span>
            </label>
            <span>Make this entry public (visible on the site)</span>
          </div>
          <div className="admin-editor-actions">
            <button className="submit-btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update entry' : 'Save entry'}
            </button>
            {editingId && (
              <button type="button" className="admin-cancel-btn" onClick={resetForm}>Cancel edit</button>
            )}
          </div>
        </form>

        <div className="admin-entries">
          <h2>All entries</h2>
          {loadingEntries && <div className="admin-empty">Loading…</div>}
          {!loadingEntries && entries.length === 0 && <div className="admin-empty">No entries yet.</div>}
          {entries.map(entry => (
            <div className="admin-entry-row" key={entry.id}>
              <div>
                <div className="admin-entry-title">
                  {entry.title}
                  <span className={`admin-badge ${entry.isPublic ? 'public' : 'private'}`}>
                    {entry.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <div className="admin-entry-date">{entry.date}</div>
                <div className="admin-entry-preview">{stripHtml(entry.content)}</div>
              </div>
              <div className="admin-entry-actions">
                <button onClick={() => startEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)} className="admin-delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminApp;