import { Modal } from '../../components/Modal';
import { Button } from './Button';
import Icon from '../Icon';

const TONES = {
  danger: { icon: 'alert-triangle', className: 'danger' },
  success: { icon: 'check-circle', className: 'success' },
  warning: { icon: 'alert-circle', className: 'warning' },
  info: { icon: 'info', className: 'info' },
};

export const ConfirmDialog = ({
  open = false,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  const t = TONES[tone] || TONES.danger;
  return (
    <Modal
      title={title}
      onClose={loading ? () => {} : onCancel}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-center">
        <div className={`dialog-icon ${t.className}`.trim()} style={{ margin: '0 auto 16px' }}>
          <Icon name={t.icon} size={26} />
        </div>
        {message && <p style={{ color: 'var(--text-light)' }}>{message}</p>}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;