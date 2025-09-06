
import React, { useRef, useState, useEffect } from 'react';
import { Icon } from './Icon';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const clearImage = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">Imagem de Referência (Opcional)</label>
      <div 
        className="group relative w-full h-48 border-2 border-dashed border-dark-border rounded-lg flex flex-col justify-center items-center text-gray-400 hover:border-brand-purple transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white font-semibold">Trocar Imagem</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors z-10"
              aria-label="Remove image"
            >
              <Icon name="trash" className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <Icon name="upload" className="w-10 h-10 mb-2 group-hover:text-brand-purple" />
            <p>Clique para enviar uma imagem</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </>
        )}
      </div>
    </div>
  );
};
