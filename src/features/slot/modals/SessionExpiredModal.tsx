import { CheckCircle, Hourglass, RefreshCw } from 'lucide-react';

import { Modal } from '@/components/modal';
import { t } from '@/utils/i18n';

interface SessionExpiredModalProps {
  open: boolean;
  onClose: () => void;
  elevated?: boolean;
}

export function SessionExpiredModal({
  open,
  onClose,
  elevated = false,
}: SessionExpiredModalProps) {
  if (!open) return null;

  return (
    <Modal
      icon={<Hourglass size={28} />}
      title={t('session_expired_title')}
      subtitle={t('session_expired_subtitle')}
      size="narrow"
      className={`smp-status-modal${elevated ? ' smp-modal-backdrop--elevated' : ''}`}
      onClose={onClose}
    >
      <div className="smp-modal-info-row">
        <CheckCircle size={20} className="smp-modal-info-row-icon" />
        <p>{t('session_expired_progress')}</p>
      </div>
      <button
        type="button"
        className="smp-modal-action smp-modal-action--with-icon"
        onClick={() => window.location.reload()}
      >
        <RefreshCw size={18} />
        {t('session_expired_reconnect')}
      </button>
    </Modal>
  );
}
