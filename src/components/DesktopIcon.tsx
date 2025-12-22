'use client';

import { useState } from 'react';

interface DesktopIconProps {
  label: string;
  icon: null | string;
  position: {
    x: number;
    y: number;
  };
}

export default function DesktopIcon({ label, icon, position }: DesktopIconProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`desktop-icon ${isPressed ? 'pressed' : ''}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className="icon-image">
        {icon === null ? (
          <div className="icon-placeholder" />
        ) : (
          icon
        )}
      </div>
      <div className="icon-label">{label}</div>
    </div>
  );
}
