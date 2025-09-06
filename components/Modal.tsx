
import React from 'react';
import { Icon } from './Icon';

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative p-4 bg-dark-card rounded-lg max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-brand-purple text-white rounded-full p-2 hover:bg-violet-700 transition-colors"
          aria-label="Close"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>
        <img src={imageUrl} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain rounded-md" />
      </div>
    </div>
  );
};
