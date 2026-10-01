import { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebarTable } from '../context/SidebarTableContext';
import { getInitials, imageUrl } from '../utils/helpers';
import Icon from './Icon';
import { Logo } from './Logo';
import { Breadcrumb } from './ui/Breadcrumb';

const sectionOrder = {
  Overview: 0,
  'Pets & Care': 1,
  Practice: 1,
  Listings: 1,
  Management: 1,
  Store: 2,
  Content: 3,
  Support: 4,
  Account: 5,
};

const sectionIcons = {
  Overview: 'dashboard',
  'Pets & Care': 'paw',
  Practice: 'stethoscope',
  Listings: 'heart',
  Management: 'shield',
  Store: 'bag',
  Content: 'file-text',
  Support: 'message',
  Account: 'user',
  General: 'box',
};

export const DashboardLayout = ({ links }) => {
  const { user, logout, unreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { handleActiveLinkClick } = useSidebarTable();

  const current = links.find((l) =>
    l.end ? location.pathname === l.to : location.pathname.startsWith(l.to) && (location.pathname === l.to || location.pathname[l.to.length] === '/')
  );
  const currentLabel = current?.label || 'Dashboard';
  const groups = links.reduce((acc, l) => {
    (acc[l.section || 'General'] = acc[l.section || 'General'] || []).push(l);
    return acc;
  }, {});

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    setDrawer(false);
    setUserMenu(false);
  }, [location.pathname]);

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

return (
    <div className="app-layout">
      <a className="skip-link" href="#dashboard-main">
        Skip to content
      </a>
      <div className="dashboard-shell">
        <aside className={`sidebar ${drawer ? 'open' : ''}`} aria-label="Dashboard navigation" onClick={(e) => e.stopPropagation()}>
          <Link to="/" className="sidebar-logo" onClick={() => setDrawer(false)}>
            <Logo light />
          </Link>

          <nav className="sidebar-nav">
            {Object.entries(groups)
              .sort((a, b) => (sectionOrder[a[0]] ?? 9) - (sectionOrder[b[0]] ?? 9))
              .map(([group, items]) => (
                <div key={group}>
                  <div className="sidebar-group-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name={sectionIcons[group] || 'box'} size={14} style={{ opacity: 0.9 }} />
                    <span>{group}</span>
                  </div>
                  {items.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
                      onClick={(e) => {
                        const isExactMatch = link.end ? location.pathname === link.to : location.pathname === link.to;
                        const isSubRoute = !link.end && location.pathname.startsWith(link.to + '/');
                        if (isExactMatch) {
                          // Clicking the exact active link - toggle/show table
                          e.preventDefault();
                          handleActiveLinkClick(link.to);
                        } else if (isSubRoute) {
                          // Clicking parent link while on sub-route - navigate to parent
                          setDrawer(false);
                          // Allow default navigation to link.to
                        } else {
                          // Clicking different link - navigate normally
                          setDrawer(false);
                        }
                      }}
                    >
                      <Icon name={link.icon} size={18} />
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              ))}
          </nav>

          <div className="sidebar-footer">
            <Link to="/" className="sidebar-link" onClick={() => setDrawer(false)}>
              <Icon name="external-link" size={17} />
              Back to site
            </Link>
            <button type="button" className="sidebar-link sidebar-logout" onClick={() => { setDrawer(false); handleLogout(); }} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}>
              <Icon name="log-out" size={17} />
              Log out
            </button>
          </div>
        </aside>

        <main className="dashboard-content" id="dashboard-main" onClick={() => drawer && setDrawer(false)}>
          <header className="topbar">
            <div className="topbar-left">
              <button
                type="button"
                className="topbar-hamburger"
                onClick={() => setDrawer(true)}
                aria-label="Open dashboard menu"
                aria-expanded={drawer}
              >
                <Icon name="menu" size={20} />
              </button>
              <div>
                <Breadcrumb
                  items={[{ label: currentLabel }]}
                />
                <h1 className="topbar-title">{currentLabel}</h1>
              </div>
            </div>
            <div className="topbar-actions">
              <Link to="/notifications" className="icon-btn" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} title="Notifications">
                <Icon name="bell" size={19} />
                {unreadCount > 0 && <span className="count-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </Link>
              <Link to="/cart" className="icon-btn" aria-label="Cart" title="Cart">
                <Icon name="cart" size={19} />
              </Link>
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button
                  className="nav-avatar"
                  onClick={() => setUserMenu((o) => !o)}
                  aria-label="Account menu"
                  aria-expanded={userMenu}
                  title="Account"
                >
                  {user?.profileImage ? (
                    <img src={imageUrl(user.profileImage)} alt="" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                  ) : (
                    getInitials(user?.name)
                  )}
                </button>
                {userMenu && (
                  <div className="user-menu" role="menu">
                    <div className="user-menu-head">
                      <span className="nav-avatar" style={{ width: 40, height: 40 }}>
                        {user?.profileImage ? (
                          <img src={imageUrl(user.profileImage)} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                        ) : (
                          getInitials(user?.name)
                        )}
                      </span>
                      <span>
                        <strong style={{ display: 'block', fontSize: '0.92rem' }}>{user?.name}</strong>
                        <small style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</small>
                      </span>
                    </div>
                    <Link to="/profile" role="menuitem" onClick={() => setUserMenu(false)}>
                      <Icon name="user" size={17} />
                      My Profile
                    </Link>
                    <Link to="/notifications" role="menuitem" onClick={() => setUserMenu(false)}>
                      <Icon name="bell" size={17} />
                      Notifications
                    </Link>
                    <div className="dropdown-sep" />
                    <button onClick={handleLogout} role="menuitem" className="logout-btn">
                      <Icon name="log-out" size={17} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;