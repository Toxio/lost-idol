import { WifiOff } from 'lucide-react';

import { Modal } from '@/components/modal';
import { t } from '@/utils/i18n';

interface ConnectionLostModalProps {
  open: boolean;
  onClose: () => void;
  /** Render above splash screen (initial connection failure). */
  elevated?: boolean;
}

export function ConnectionLostModal({ open, onClose, elevated = false }: ConnectionLostModalProps) {
  if (!open) return null;

  return (
    <Modal
      icon={<WifiOff size={28} />}
      title={t('connection_lost_title')}
      subtitle={t('connection_lost_subtitle')}
      size="narrow"
      className={elevated ? 'smp-modal-backdrop--elevated' : undefined}
      onClose={onClose}
    >
      <button type="button" className="smp-modal-action" onClick={() => window.location.reload()}>
        {t('connection_lost_retry')}
      </button>
    </Modal>
  );
}
