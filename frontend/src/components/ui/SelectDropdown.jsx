import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const normalize = (options) =>
  (options || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

export const SelectDropdown = ({
  value = '',
  options = [],
  placeholder = 'Select...',
  onChange,
  name,
  className = '',
  ariaLabel = '',
  style,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [flipUp, setFlipUp] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  const items = useMemo(() => normalize(options), [options]);
  const selected = items.find((o) => o.value === value);
  const label = selected ? selected.label : placeholder;

  const place = () => {
    const trigger = rootRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const estHeight = Math.min(items.length * 42 + 12, 260);
    const spaceBelow = window.innerHeight - rect.bottom;
    const flip = spaceBelow < estHeight && rect.top > estHeight;
    setFlipUp(flip);
    setPos({
      top: flip ? rect.top - estHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onDocClick = (e) => {
      const menu = menuRef.current;
      if (!menu || rootRef.current.contains(e.target) || menu.contains(e.target)) return;
      setOpen(false);
      setHighlight(-1);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setHighlight(-1);
      }
    };
    const reposition = () => place();
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, items.length]);

  const select = (o) => {
    if (o.disabled) return;
    if (name) onChange({ target: { name, value: o.value } });
    else onChange(o.value);
    setOpen(false);
    setHighlight(-1);
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      setHighlight((h) => {
        const enabled = items.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i !== -1);
        if (enabled.length === 0) return -1;
        const current = enabled.indexOf(h);
        const next = (current + dir + enabled.length) % enabled.length;
        return enabled[next];
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlight >= 0 && items[highlight]) select(items[highlight]);
    } else if (e.key === 'Tab') {
      setOpen(false);
      setHighlight(-1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`select-dropdown ${open ? 'is-open' : ''} ${className}`.trim()}
      style={style}
    >
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        className="select-dropdown-trigger"
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span className={`sd-label ${selected ? '' : 'sd-placeholder'}`}>{label}</span>
        <svg
          className="sd-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            className={`select-dropdown-menu ${flipUp ? 'open-up' : ''}`}
            style={{ ...pos }}
          >
            {items.length === 0 && (
              <li className="select-dropdown-option is-disabled" role="option">
                No options
              </li>
            )}
            {items.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                className={`select-dropdown-option ${o.value === value ? 'is-selected' : ''} ${i === highlight ? 'is-highlighted' : ''} ${o.disabled ? 'is-disabled' : ''}`.trim()}
                onClick={() => select(o)}
                onMouseEnter={() => !o.disabled && setHighlight(i)}
              >
                <span>{o.label}</span>
                {o.value === value && <span className="sd-check">✓</span>}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default SelectDropdown;