import { useEffect, useRef } from 'react';
import Icon from './Icon';

export const Modal = ({ title, onClose, children, footer = null, size = 'md', hideClose = false }) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handler);
    const previouslyFocused = document.activeElement;
    if (dialogRef.current) {
      const focusable = dialogRef.current.querySelector('[data-autofocus], button, [href], input, select, textarea');
      (focusable || dialogRef.current).focus();
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`modal ${size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          {!hideClose && (
            <button className="modal-close" onClick={onClose} aria-label="Close dialog">
              <Icon name="x" size={18} />
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;