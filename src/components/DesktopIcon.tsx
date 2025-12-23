'use client';

import { useState } from 'react';

interface DesktopIconProps {
  label: string;
  icon: string;
  x: number;
  y: number;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ label, icon, x, y, onDoubleClick }: DesktopIconProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Verificar si el icono es una ruta de imagen válida
  const isImagePath = icon && (icon.endsWith('.svg') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg') || icon.endsWith('.gif') || icon.startsWith('/') || icon.startsWith('http'));

  return (
    <div
      className="desktop-icon"
      style={{ left: x, top: y }}
      onDoubleClick={onDoubleClick}
    >
      {isImagePath && !imageError ? (
        <div className="icon-image-container">
          <img
            src={icon}
            alt={label}
            className="icon-image"
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          {!imageLoaded && !imageError && (
            <div className="icon-placeholder">...</div>
          )}
        </div>
      ) : (
        <div className="icon-rectangle">
          <span className="icon-rectangle-text">{label}</span>
        </div>
      )}
      <div className="icon-label">{label}</div>
    </div>
  );
}
