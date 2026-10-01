import { Link } from 'react-router-dom';
import Icon from './Icon';
import { LogoMark } from './Logo';

const exploreLinks = [
  { to: '/veterinarians', label: 'Find a Vet', icon: 'stethoscope' },
  { to: '/products', label: 'Pet Products', icon: 'bag' },
  { to: '/adoption', label: 'Adoption', icon: 'heart' },
  { to: '/care', label: 'Care Resources', icon: 'sparkles' },
];

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'FAQs' },
  { to: '/register', label: 'Join as a Vet' },
];

const accountLinks = [
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Sign up' },
  { to: '/cart', label: 'My Cart' },
  { to: '/notifications', label: 'Notifications' },
];

export const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">
            <LogoMark size={34} />
            <span>FurShield</span>
          </span>
          <p>
            The trusted pet-care platform connecting pet owners, veterinarians, shelters and pet-care
            resources — complete care for every paw, in one place.
          </p>
          <div className="footer-socials mt-3">
            <a href="#" className="social-btn" aria-label="Follow FurShield on Instagram">
              <Icon name="camera" size={17} />
            </a>
            <a href="#" className="social-btn" aria-label="Follow FurShield on X">
              <Icon name="star" size={17} />
            </a>
            <a href="#" className="social-btn" aria-label="Subscribe to FurShield on YouTube">
              <Icon name="video" size={17} />
            </a>
            <a href="mailto:hello@furshield.com" className="social-btn" aria-label="Email FurShield">
              <Icon name="mail" size={17} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          {exploreLinks.map((l) => (
            <Link to={l.to} key={l.to}>
              {l.icon ? <Icon name={l.icon} size={15} /> : null}
              {l.label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          {companyLinks.map((l) => (
            <Link to={l.to} key={l.to}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          {accountLinks.map((l) => (
            <Link to={l.to} key={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FurShield. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
        </div>
        <span>Made with care for pets <Icon name="paw" size={16} style={{ verticalAlign: 'middle' }} /></span>
      </div>
    </div>
  </footer>
);

export default Footer;