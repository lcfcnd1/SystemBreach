'use client';

import { useState, useRef, useEffect } from 'react';
import { WindowState } from '@/types/system';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export default function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragEnd
}: WindowProps) {
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: window.x, y: window.y });
  const positionRef = useRef({ x: window.x, y: window.y });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newPos = { x: window.x, y: window.y };
    setPosition(newPos);
    positionRef.current = newPos;
  }, [window.x, window.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    onFocus();
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      positionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
        onDragEnd(positionRef.current.x, positionRef.current.y);
      }
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset, position, onDragEnd]);

  if (window.minimized) return null;

  const style: React.CSSProperties = window.maximized
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - 40px)',
        zIndex: window.zIndex
      }
    : {
        left: position.x,
        top: position.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex
      };

  return (
    <div
      ref={windowRef}
      className="window"
      style={style}
      onClick={onFocus}
    >
      <div className="window-titlebar" onMouseDown={handleMouseDown}>
        <span className="window-title">{window.title}</span>
        <div className="window-controls">
          <button className="window-btn minimize-btn" onClick={onMinimize}>
            _
          </button>
          <button className="window-btn maximize-btn" onClick={onMaximize}>
            □
          </button>
          <button className="window-btn close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      <div className="window-content">
        {window.content}
      </div>
    </div>
  );
}
