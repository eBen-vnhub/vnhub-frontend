import { X } from 'lucide-react';
import Button from '../ui/Button';

interface NextActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NextActionModal({ isOpen, onClose }: NextActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-hover/50">
          <h2 className="text-lg font-bold text-main">Vendor Listing Form</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-main mb-2">Coming Soon</h3>
          <p className="text-muted max-w-md mx-auto">
            The external vendor listing form integration will be rendered here.
          </p>
          
          <Button variant="outline" className="mt-8" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
}
