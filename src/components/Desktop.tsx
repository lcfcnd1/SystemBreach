'use client';

import { useState, useEffect } from 'react';
import Window from './Window';
import TaskBar from './TaskBar';
import DesktopIcon from './DesktopIcon';
import { SystemConfig, WindowState } from '@/types/system';

export default function Desktop() {
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);

  useEffect(() => {
    fetch('/api/system')
      .then(res => res.json())
      .then(data => setSystemConfig(data))
      .catch(err => console.error('Error loading system config:', err));
  }, []);

  const createWindow = (title: string, content: React.ReactNode) => {
    const newWindow: WindowState = {
      id: `window-${Date.now()}`,
      title,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: 600,
      height: 400,
      zIndex: nextZIndex,
      minimized: false,
      maximized: false,
      content
    };
    
    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ));
  };

  const focusWindow = (id: string) => {
    const targetWindow = windows.find(w => w.id === id);
    if (!targetWindow) return;
    
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, minimized: false } : w
    ));
    setNextZIndex(nextZIndex + 1);
  };

  const updateWindowPosition = (id: string, x: number, y: number) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  };

  const handleIconDoubleClick = (iconLabel: string) => {
    createWindow(
      iconLabel,
      <div className="empty-window">
        <p>Sistema sin contenido</p>
        <p className="text-dim">Aplicación: {iconLabel}</p>
      </div>
    );
  };

  return (
    <div className="desktop">
      <div className="desktop-icons">
        {systemConfig?.desktop.icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            label={icon.label}
            icon={icon.icon}
            x={icon.x}
            y={icon.y}
            onDoubleClick={() => handleIconDoubleClick(icon.label)}
          />
        ))}
      </div>

      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          onDragEnd={(x, y) => updateWindowPosition(window.id, x, y)}
        />
      ))}

      <TaskBar 
        windows={windows}
        onWindowClick={focusWindow}
      />
    </div>
  );
}
