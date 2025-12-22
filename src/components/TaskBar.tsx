'use client';

import { WindowState } from '@/types/system';

interface TaskBarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
}

export default function TaskBar({ windows, onWindowClick }: TaskBarProps) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="taskbar">
      <div className="taskbar-start">
        <button className="start-button">
          <span className="start-icon">◢</span>
          <span>SYSTEM</span>
        </button>
      </div>
      
      <div className="taskbar-windows">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`taskbar-window-btn ${win.minimized ? 'minimized' : ''}`}
            onClick={() => onWindowClick(win.id)}
          >
            {win.title}
          </button>
        ))}
      </div>
      
      <div className="taskbar-tray">
        <div className="system-tray">
          <span className="tray-item">◉</span>
          <span className="tray-item">▣</span>
        </div>
        <div className="taskbar-clock">{timeString}</div>
      </div>
    </div>
  );
}
