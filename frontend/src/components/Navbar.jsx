import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials, imageUrl } from '../utils/helpers';
import Icon from './Icon';
import { Logo } from './Logo';

const publicLinks = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/veterinarians', label: 'Find a Vet', icon: 'stethoscope' },
  { to: '/products', label: 'Products', icon: 'bag' },
  { to: '/care', label: 'Pet Care', icon: 'sparkles' },
  { to: '/adoption', label: 'Adoption', icon: 'heart' },
  { to: '/about', label: 'About', icon: 'users' },
  { to: '/contact', label: 'Contact', icon: 'mail' },
];

const dashboardPath = {
  owner: '/owner',
  veterinarian: '/veterinarian',
  shelter: '/shelter',
  admin: '/admin',
};

export const Navbar = () => {
  const { user, logout, unreadCount, cartCount } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userMenu) return;
    const onDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setUserMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="container navbar-inner">
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
        </button>

        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)} aria-label="FurShield home">
          <Logo />
        </Link>

        <ul className="navbar-links">
          {publicLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}
                onClick={() => setMenuOpen(false)}
              >
                <Icon name={link.icon} size={16} />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link
                to="/notifications"
                className="icon-btn"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                title="Notifications"
              >
                <Icon name="bell" size={19} />
                {unreadCount > 0 && <span className="count-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </Link>
              <Link to="/cart" className="icon-btn" aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`} title="Cart">
                <Icon name="cart" size={19} />
                {cartCount > 0 && <span className="count-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button
                  className="nav-avatar"
                  onClick={() => setUserMenu((o) => !o)}
                  aria-label="Account menu"
                  aria-expanded={userMenu}
                  title="Account"
                >
                  {user.profileImage ? (
                    <img src={imageUrl(user.profileImage)} alt="" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                  ) : (
                    getInitials(user.name)
                  )}
                </button>
                {userMenu && (
                  <div className="user-menu" role="menu">
                    <div className="user-menu-head" aria-hidden="true">
                      <span className="nav-avatar" style={{ width: 40, height: 40 }}>
                        {user.profileImage ? (
                          <img src={imageUrl(user.profileImage)} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                        ) : (
                          getInitials(user.name)
                        )}
                      </span>
                      <span>
                        <strong style={{ display: 'block', fontSize: '0.92rem' }}>{user.name}</strong>
                        <small style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</small>
                      </span>
                    </div>
                    <Link to={dashboardPath[user.role] || '/dashboard'} role="menuitem" onClick={() => setUserMenu(false)}>
                      <Icon name="dashboard" size={17} />
                      My Dashboard
                    </Link>
                    <Link to="/notifications" role="menuitem" onClick={() => setUserMenu(false)}>
                      <Icon name="bell" size={17} />
                      Notifications
                    </Link>
                    <Link to="/profile" role="menuitem" onClick={() => setUserMenu(false)}>
                      <Icon name="user" size={17} />
                      My Profile
                    </Link>
                    <div className="dropdown-sep" />
                    <button onClick={handleLogout} role="menuitem" className="logout-btn">
                      <Icon name="log-out" size={17} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>

      {menuOpen && (
        <div className="mobile-nav" id="mobile-nav">
          {user && (
            <div className="mobile-nav-user">
              <span className="nav-avatar">
                {user.profileImage ? (
                  <img src={imageUrl(user.profileImage)} alt="" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                ) : (
                  getInitials(user.name)
                )}
              </span>
              <div>
                <strong style={{ display: 'block' }}>{user.name}</strong>
                <small className="text-caption" style={{ textTransform: 'capitalize' }}>
                  {user.role}
                </small>
              </div>
            </div>
          )}
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={link.icon} size={18} />
              {link.label}
            </NavLink>
          ))}
          <div className="mobile-nav-actions">
            {user ? (
              <>
                <Link to={dashboardPath[user.role] || '/dashboard'} className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>
                  <Icon name="dashboard" size={16} />
                  My Dashboard
                </Link>
                <button className="btn btn-outline btn-block" onClick={handleLogout}>
                  <Icon name="log-out" size={16} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-block" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;