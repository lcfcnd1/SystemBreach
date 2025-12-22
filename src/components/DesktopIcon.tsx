'use client';

interface DesktopIconProps {
  label: string;
  icon: string;
  x: number;
  y: number;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ label, icon, x, y, onDoubleClick }: DesktopIconProps) {
  return (
    <div
      className="desktop-icon"
      style={{ left: x, top: y }}
      onDoubleClick={onDoubleClick}
    >
      <div className="icon-image">{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
}
