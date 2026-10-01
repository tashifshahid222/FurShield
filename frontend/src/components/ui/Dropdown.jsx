import { useEffect, useRef, useState } from 'react';
import IconName from '../Icon';

export const Dropdown = ({ trigger, children, align = 'right', width, className = '', closeOnClick = true }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={`dropdown ${className}`.trim()} ref={ref}>
      <div onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        {trigger}
      </div>
      {open && (
        <div
          className="dropdown-menu"
          role="menu"
          aria-label="Dropdown"
          style={{ right: align === 'right' ? 0 : 'auto', left: align === 'left' ? 0 : 'auto', minWidth: width }}
          onClick={closeOnClick ? () => setOpen(false) : undefined}
        >
          {typeof children === 'function' ? children(setOpen) : children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ icon, children, danger = false, onClick, className = '' }) => (
  <button type="button" role="menuitem" className={`dropdown-item ${danger ? 'danger' : ''} ${className}`.trim()} onClick={onClick}>
    {icon ? <IconName name={icon} size={16} /> : null}
    {children}
  </button>
);

export const DropdownSeparator = () => <div className="dropdown-sep" />;
export const DropdownLabel = ({ children }) => <div className="dropdown-label">{children}</div>;

export default Dropdown;