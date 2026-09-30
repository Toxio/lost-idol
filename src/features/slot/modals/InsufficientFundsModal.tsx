import { Modal } from '@/components/modal';
import { play as playSound } from '@/audio/soundManager';
import { t } from '@/utils/i18n';
import './InsufficientFundsModal.css';

interface InsufficientFundsModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export function InsufficientFundsModal({
  open,
  onClose,
  message = t('insufficient_message'),
}: InsufficientFundsModalProps) {
  if (!open) return null;

  return (
    <Modal badge={t('insufficient_badge')} title={t('insufficient_title')} size="narrow" onClose={onClose}>
      <p className="smp-inf-text">{message}</p>

      <button type="button" className="smp-modal-action" onClick={() => { playSound('ui_button'); onClose(); }}>
        {t('insufficient_close')}
      </button>
    </Modal>
  );
}
