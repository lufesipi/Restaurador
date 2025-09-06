import React from 'react';
import { Icon } from './Icon';

interface ImageCardProps {
  src: string;
  title: string;
  onView: () => void;
  onDownload?: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ src, title, onView, onDownload }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-center mb-2 text-gray-300">{title}</h3>
      <div className="group relative aspect-square bg-dark-card rounded-lg overflow-hidden shadow-lg border border-dark-border">
        <img src={src} alt={title} className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={onView}
            className="bg-white/20 text-white rounded-full p-3 hover:bg-white/30 backdrop-blur-sm transition-colors"
            aria-label="Ver maior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          {onDownload && (
            <button 
              onClick={onDownload}
              className="bg-white/20 text-white rounded-full p-3 hover:bg-white/30 backdrop-blur-sm transition-colors"
              aria-label="Baixar imagem"
            >
              <Icon name="download" className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};