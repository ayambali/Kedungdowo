import React from 'react';
import Icon from '../../components/Icon';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Hapus",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return 'delete_forever';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'warning';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'danger': return 'bg-error text-on-error hover:bg-error/90';
      case 'warning': return 'bg-primary text-on-primary hover:bg-primary/90';
      case 'info': return 'bg-secondary text-on-secondary hover:bg-secondary/90';
      default: return 'bg-error text-on-error hover:bg-error/90';
    }
  };

  const getIconBgClass = () => {
    switch (type) {
      case 'danger': return 'bg-error/10 text-error';
      case 'warning': return 'bg-primary/10 text-primary';
      case 'info': return 'bg-secondary/10 text-secondary';
      default: return 'bg-error/10 text-error';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-4 md:p-6 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getIconBgClass()}`}>
            <Icon name={getIcon()} className="text-2xl md:text-3xl" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-background mb-2">{title}</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">{message}</p>
        </div>
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${getColorClass()} disabled:opacity-70`}
          >
            {isLoading && <Icon name="progress_activity" className="animate-spin text-sm" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
