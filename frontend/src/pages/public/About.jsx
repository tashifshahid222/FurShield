import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import Reveal from '../../components/Reveal';

const stats = [
  { number: '15,000+', label: 'Happy pet owners', icon: 'users' },
  { number: '1,200+', label: 'Trusted veterinarians', icon: 'stethoscope' },
  { number: '300+', label: 'Verified shelters', icon: 'building' },
  { number: '45,000+', label: 'Products & supplies', icon: 'bag' },
];

const values = [
  { icon: 'heart', title: 'Compassion first', text: 'Every decision we make prioritizes the well-being of animals above all else.', className: '' },
  { icon: 'flask', title: 'Evidence-based care', text: 'We partner with qualified professionals to bring accurate, expert-driven guidance.', className: 'blue' },
  { icon: 'map-pin', title: 'Community focused', text: 'We bring owners, vets and shelters together to build stronger pet communities.', className: 'green' },
  { icon: 'shield', title: 'Trust & transparency', text: 'Verified profiles, honest reviews and secure handling of your data.', className: 'amber' },
];

const whoHelps = [
  {
    icon: 'paw',
    className: '',
    title: 'For pet owners',
    text: 'Track every detail of your pet’s health, book appointments, shop smarter and adopt your next best friend.',
    cta: { label: 'Join free', to: '/register' },
  },
  {
    icon: 'stethoscope',
    className: 'blue',
    title: 'For veterinarians',
    text: 'Manage availability, appointments and detailed patient records — all in one calm dashboard.',
    cta: { label: 'Partner with us', to: '/register' },
  },
  {
    icon: 'building',
    className: 'green',
    title: 'For shelters',
    text: 'Publish adoptable pets, track care records and coordinate adoptions in one place.',
    cta: { label: 'Get started', to: '/register' },
  },
];

export const About = () => (
  <>
    <section className="hero" style={{ padding: '64px 0 40px' }}>
      <div className="container text-center">
        <span className="section-eyebrow">
          <span className="dot" aria-hidden="true" /> About FurShield
        </span>
        <h1 style={{ marginBottom: 14, fontSize: 'clamp(2.2rem, 4vw + 0.5rem, 3.2rem)' }}>
          Caring for pets, <span className="text-gradient">all in one place</span>
        </h1>
        <p className="section-subtitle" style={{ marginInline: 'auto', maxWidth: 640 }}>
          Our mission is simple — to protect and empower every pet's care journey by bringing
          owners, veterinarians and shelters together on one trusted platform.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link to="/register" className="btn btn-primary">Join free</Link>
          <Link to="/care" className="btn btn-outline">Explore care resources</Link>
        </div>
      </div>

      <div className="container" style={{ marginTop: 40 }}>
        <div className="stats-bar">
          {stats.map((s) => (
            <div className="stat-box" key={s.label}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">
                <Icon name={s.icon} size={14} />
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Reveal as="section" className="page-section">
      <div className="container">
        <div className="about-mission">
          <div className="value-icon" style={{ color: 'var(--primary)' }}>
            <Icon name="shield-heart" size={26} />
          </div>
          <h2>Our Story</h2>
          <p style={{ color: 'var(--text-light)', marginTop: 12 }}>
            FurShield was founded on the belief that pet care should never be fragmented.
            Pet parents juggle vet records, appointment books, product research and adoption
            paperwork across dozens of apps and notebooks. We built one centralized platform —
            bringing pet profiles, health histories, veterinary appointments, care resources,
            products and shelter adoptions together in a single, friendly experience.
          </p>
          <p style={{ color: 'var(--text-light)', marginTop: 12 }}>
            Today FurShield connects thousands of pet owners with trusted veterinarians,
            verified animal shelters and quality products — always keeping the animal's health
            and happiness at the center.
          </p>
        </div>
      </div>
      </Reveal>

    <Reveal as="section" className="page-section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="section-head-center">
          <span className="section-eyebrow">
            <span className="dot" aria-hidden="true" /> Our values
          </span>
          <h2 className="section-title">The principles that guide us</h2>
          <p className="section-subtitle">Everything we build starts with these four commitments</p>
        </div>
        <div className="grid grid-4">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <div className={`value-icon ${v.className}`.trim()}>
                <Icon name={v.icon} size={26} />
              </div>
              <h3>{v.title}</h3>
              <p className="text-muted text-small">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
      </Reveal>

    <Reveal as="section" className="page-section muted">
      <div className="container">
        <div className="section-head-center">
          <span className="section-eyebrow">
            <span className="dot" aria-hidden="true" /> Who we help
          </span>
          <h2 className="section-title">Built for everyone in the journey</h2>
          <p className="section-subtitle">One platform, three communities, endless wagging tails</p>
        </div>
        <div className="grid grid-3 tiles-dark">
          {whoHelps.map((w) => (
            <div className="feature-tile" key={w.title}>
              <div className={`feature-icon ${w.className}`.trim()}>
                <Icon name={w.icon} size={22} />
              </div>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
              <Link to={w.cta.to} className="btn btn-outline btn-sm mt-2">{w.cta.label}</Link>
            </div>
          ))}
        </div>
      </div>
      </Reveal>

    <Reveal as="section" className="page-section">
      <div className="container">
        <div className="cta-panel">
          <h2>Ready to join the FurShield family?</h2>
          <p>
            Create your free account today and give your furry friend the care journey they deserve.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">Create free account</Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}>Contact us</Link>
          </div>
        </div>
      </div>
      </Reveal>
  </>
);

export default About;