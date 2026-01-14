import React from 'react';
import { Button } from '../ui/Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    isLoading = false
}) => {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        globalThis.addEventListener('keydown', handleEscape);
        return () => globalThis.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <button
                type="button"
                className="absolute inset-0 w-full h-full cursor-default bg-transparent border-none"
                onClick={onClose}
                aria-label="Close backdrop"
            />
            <dialog
                className="relative w-full max-w-md bg-cream-50 dark:bg-charcoal-800 rounded-3xl border border-cream-400 dark:border-charcoal-700 shadow-soft-lg overflow-hidden animate-in zoom-in-95 duration-200"
                aria-labelledby="modal-title"
                open={isOpen}
            >
                <div className="p-8">
                    <h3 id="modal-title" className="text-2xl font-bold text-charcoal-800 dark:text-cream-100 tracking-tighter mb-4">
                        {title}
                    </h3>
                    <p className="text-charcoal-700 dark:text-cream-300 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            fullWidth
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant='primary'
                            className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600 border-red-500' : ''}
                            onClick={onConfirm}
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : confirmText}
                        </Button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ConfirmModal;
