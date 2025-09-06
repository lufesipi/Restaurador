
import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const options: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Quadrado' },
  { value: '16:9', label: 'Paisagem' },
  { value: '9:16', label: 'Retrato' },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Formato</label>
      <div className="flex space-x-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple ${
              value === option.value
                ? 'bg-brand-purple text-white'
                : 'bg-dark-card text-gray-300 hover:bg-dark-border'
            }`}
          >
            {option.label} ({option.value})
          </button>
        ))}
      </div>
    </div>
  );
};
