'use client';

import { useState, useEffect } from 'react';
import Window from './Window';
import TaskBar from './TaskBar';
import DesktopIcon from './DesktopIcon';
import { SystemConfig, WindowState, DesktopIcon as DesktopIconType } from '@/types/system';
import { AppComponents } from './apps';

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

  const createWindow = (title: string, content: React.ReactNode, appId?: string) => {
    // Verificar si la app permite múltiples instancias
    if (appId && systemConfig) {
      const app = systemConfig.apps.find(a => a.id === appId);
      if (app && app.allowMultiple === false) {
        // Buscar si ya existe una ventana de esta app
        const existingWindow = windows.find(w => {
          const windowAppId = (w as any).appId;
          return windowAppId === appId;
        });
        if (existingWindow) {
          focusWindow(existingWindow.id);
          return;
        }
      }
    }

    const newWindow: WindowState & { appId?: string } = {
      id: `window-${Date.now()}`,
      title,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: 800,
      height: 600,
      zIndex: nextZIndex,
      minimized: false,
      maximized: false,
      content,
      appId
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

  const handleIconDoubleClick = (icon: DesktopIconType) => {
    if (!systemConfig) return;

    // Buscar la app asociada
    const app = icon.appId ? systemConfig.apps.find(a => a.id === icon.appId) : null;

    if (app && app.component) {
      // Cargar el componente dinámicamente
      const AppComponent = AppComponents[app.component];
      
      if (AppComponent) {
        let content: React.ReactNode;

        // Pasar props específicas según el componente
        if (app.component === 'TerminalWindow') {
          content = <AppComponent systemConfig={systemConfig} />;
        } else if (app.component === 'FileManager') {
          // Si hay openFile, usar el directorio padre; si no, usar /home/guest
          const filePath = icon.openFile || '/home/guest';
          const dirPath = filePath.includes('/') ? filePath.substring(0, filePath.lastIndexOf('/')) || '/' : '/';
          content = <AppComponent systemConfig={systemConfig} initialPath={dirPath} />;
        } else if (app.component === 'TextEditor') {
          content = <AppComponent systemConfig={systemConfig} initialFile={icon.openFile} />;
        } else if (app.component === 'WebBrowser') {
          content = <AppComponent />;
        } else if (app.component === 'DecryptTool') {
          content = <AppComponent systemConfig={systemConfig} />;
        } else if (app.component === 'TrashViewer') {
          content = <AppComponent />;
        } else {
          content = <div className="empty-window">
            <p>Componente no encontrado: {app.component}</p>
          </div>;
        }

        createWindow(app.name, content, app.id);
      } else {
        createWindow(
          app.name,
          <div className="empty-window">
            <p>Componente no implementado: {app.component}</p>
          </div>,
          app.id
        );
      }
    } else {
      // Si no hay app asociada, crear ventana genérica
      createWindow(
        icon.label,
        <div className="empty-window">
          <p>No hay aplicación asociada</p>
        </div>
      );
    }
  };

  // Aplicar estilos del desktop
  const getDesktopStyle = (): React.CSSProperties => {
    const background = systemConfig?.desktop.background;
    if (!background) return {};

    // Verificar si es un color hex
    if (background.startsWith('#')) {
      return { backgroundColor: background };
    }

    // Verificar si es una URL o ruta de imagen
    if (background.startsWith('http') || background.startsWith('/') || background.includes('.')) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    // Si no coincide con ningún patrón, intentar como color
    return { backgroundColor: background };
  };

  const desktopStyle = getDesktopStyle();
  const desktopClassName = `desktop ${systemConfig?.desktop.theme || 'military'}`;

  return (
    <div className={desktopClassName} style={desktopStyle}>
      <div className="desktop-icons">
        {systemConfig?.desktop.icons
          .filter(icon => {
            // Filtrar iconos de apps ocultas
            if (icon.appId) {
              const app = systemConfig.apps.find(a => a.id === icon.appId);
              return !app?.hidden;
            }
            return true;
          })
          .map((icon) => (
            <DesktopIcon
              key={icon.id}
              label={icon.label}
              icon={icon.icon}
              x={icon.x}
              y={icon.y}
              onDoubleClick={() => handleIconDoubleClick(icon)}
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
