'use client';

import { useState, useEffect } from 'react';
import { WindowState } from '@/types/system';

interface TaskBarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
}

export default function TaskBar({ windows, onWindowClick }: TaskBarProps) {
  const [timeString, setTimeString] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };

    // Actualizar inmediatamente para sincronizar con el minuto actual
    updateClock();

    // Actualizar cada minuto (60000 ms)
    const intervalId = setInterval(updateClock, 60000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

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
