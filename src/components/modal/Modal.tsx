import clsx from 'clsx';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { play as playSound } from '@/audio/soundManager';
import { useBackdropDismiss } from '@/hooks/useBackdropDismiss';
import './Modal.css';

interface ModalProps {
  badge?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
  size?: 'default' | 'narrow';
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({
  badge,
  icon,
  title,
  subtitle,
  ariaLabel,
  size = 'default',
  className,
  onClose,
  children,
}: ModalProps) {
  const hasHeader = Boolean(icon || badge || title || subtitle);
  const { onBackdropClick, stopDialogPropagation } = useBackdropDismiss(onClose);

  return createPortal(
    <div
      className={clsx('smp-modal-backdrop', className)}
      role="presentation"
      onClick={onBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'smp-modal-title' : undefined}
        aria-label={!title ? ariaLabel : undefined}
        className={clsx(
          'smp-modal-dialog',
          size === 'narrow' && 'smp-modal-dialog--narrow',
          !hasHeader && 'smp-modal-dialog--headerless',
        )}
        onMouseDown={stopDialogPropagation}
        onClick={stopDialogPropagation}
      >
        <header className="smp-modal-header">
          {title && <h2 id="smp-modal-title" className="smp-modal-title">{title}</h2>}
          <button type="button" className="smp-modal-close" onClick={() => { playSound('ui_button'); onClose(); }} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        {icon && <div className="smp-modal-icon">{icon}</div>}
        {badge && <span className="smp-modal-badge">{badge}</span>}

        {subtitle && <p className="smp-modal-subtitle">{subtitle}</p>}

        {children}
      </div>
    </div>,
    document.body,
  );
}
