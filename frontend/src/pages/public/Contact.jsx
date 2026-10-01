import { useState } from 'react';
import { contactApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

export const Contact = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const result = await contactApi.submit(form);
      showToast(result.message || 'Message sent successfully');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container text-center">
          <h1 style={{ marginBottom: 12 }}>Contact <span style={{ color: 'var(--primary)' }}>Us</span></h1>
          <p className="section-subtitle" style={{ marginInline: 'auto' }}>We'd love to hear from you. Reach out anytime.</p>
        </div>
      </section>

      <Reveal as="section" className="page-section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <div className="form-card">
                <h2 style={{ marginBottom: 6 }}>Send us a message</h2>
                <p className="text-muted text-small mb-3">We usually respond within 24 hours.</p>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your name <span className="required">*</span></label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-control" name="subject" value={form.subject} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message <span className="required">*</span></label>
                    <textarea className="form-control" name="message" value={form.message} onChange={handleChange} required />
                  </div>
                  <button className="btn btn-primary btn-block" type="submit" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="card card-padded card-dark mb-3">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="map-pin" size={18} /> Our location</h3>
                <p className="text-muted mt-1">
                  123 Meadow Lane<br />
                  Springfield, SP 12345<br />
                  United States
                </p>
              </div>

              <div className="card card-padded card-dark mb-3">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="phone" size={18} /> Contact details</h3>
                <p className="text-muted mt-1">
                  Email: support@furshield.com<br />
                  Phone: +1 (555) 123-4567<br />
                  Hours: Mon–Fri, 9am–6pm
                </p>
              </div>

              <div className="card mb-3" style={{ overflow: 'hidden' }}>
                <iframe
                  title="Our location map"
                  className="map-frame"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4315%2C37.7645%2C-122.4073%2C37.7853&layer=mapnik&marker=37.7749%2C-122.4194"
                  loading="lazy"
                />
                <div className="map-footer">
                  <a
                    href="https://www.openstreetmap.org/?mlat=37.7749&mlon=-122.4194#map=13/37.7749/-122.4194"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-teal btn-sm"
                  >
                    Open in OpenStreetMap
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
};

export default Contact;