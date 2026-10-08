import { AutoplayIcon } from '../ui/AutoplayIcon';
import './AutoplayStoppedModal.css';

import { Modal } from '@/components/modal';
import { play as playSound } from '@/audio/soundManager';
import { t } from '@/utils/i18n';

interface AutoplayStoppedModalProps {
  open: boolean;
  count: number | null;
  onClose: () => void;
  onRepeat: () => void;
}

export function AutoplayStoppedModal({ open, count, onClose, onRepeat }: AutoplayStoppedModalProps) {
  if (!open) return null;

  return (
    <Modal
      className="autoplay-stopped-modal"
      icon={<AutoplayIcon />}
      title={t('autoplay_stopped_title')}
      subtitle={t('autoplay_stopped_subtitle')}
      size="narrow"
      onClose={onClose}
    >
      <div className="smp-modal-actions-row">
        <button type="button" className="smp-modal-action smp-modal-action--secondary" onClick={() => { playSound('ui_button'); onClose(); }}>
          {t('autoplay_stopped_cancel')}
        </button>

        <button type="button" className="smp-modal-action" onClick={() => { playSound('ui_button'); onRepeat(); }}>
          {t('autoplay_stopped_repeat')}{count !== null ? ` (${count})` : ''}
        </button>
      </div>
    </Modal>
  );
}
