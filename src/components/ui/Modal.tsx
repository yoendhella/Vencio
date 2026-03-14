'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-[480px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[800px]',
};

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl outline-none',
            sizeClasses[size],
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
