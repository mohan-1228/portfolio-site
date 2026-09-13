import { useState } from 'react';

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

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setSubmitting(true);
    setStatus({ text: '', type: '' });
    try {
      await gqlRequest(`
        mutation CreateContactSubmission($input: CreateContactSubmissionInput!) {
          createContactSubmission(input: $input) { id }
        }
      `, { input: { name: form.name.trim(), email: form.email.trim(), message: form.message.trim() } });

      setStatus({ text: "Message sent — I'll get back to you soon.", type: 'ok' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact submit failed:', err);
      setStatus({ text: 'Something went wrong — try again, or email me directly.', type: 'err' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="eyebrow">06 — Contact</div>
        <h2 className="big-cta">
          Got something<br />worth <span className="accent">building?</span>
        </h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="field">
            <label htmlFor="ct-name">Name</label>
            <input
              id="ct-name" type="text" placeholder="Your name" required maxLength={80}
              value={form.name} onChange={e => updateField('name', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ct-email">Email</label>
            <input
              id="ct-email" type="email" placeholder="you@example.com" required maxLength={120}
              value={form.email} onChange={e => updateField('email', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ct-message">Message</label>
            <textarea
              id="ct-message" placeholder="What are you building?" required maxLength={1000}
              value={form.message} onChange={e => updateField('message', e.target.value)}
            />
          </div>
          <button className="submit-btn" type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
          <div className={`form-status ${status.type}`}>{status.text}</div>
        </form>

        <div className="hero-cta" style={{ justifyContent: 'center', marginTop: 30 }}>
          <a className="btn btn-ghost" href="https://github.com/mohan-1228" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn btn-ghost" href="https://linkedin.com/in/mohan1228" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>

        <footer className="wrap" style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
          <div>© 2026 Mohan Thapa</div>
          <div>Built in Springfield, MO</div>
        </footer>
      </div>
    </section>
  );
}

export default Contact;