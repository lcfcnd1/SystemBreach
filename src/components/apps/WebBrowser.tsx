'use client';

import { useState } from 'react';

export default function WebBrowser() {
  const [url, setUrl] = useState('darknet://');
  const [content, setContent] = useState('Bienvenido a DarkNet Web\n\nNavegador anónimo activado.');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular navegación
    if (url.startsWith('darknet://')) {
      setContent(`Navegando a: ${url}\n\n[CONEXIÓN SEGURA ESTABLECIDA]\nContenido encriptado.`);
    } else {
      setContent(`Error: Solo se permiten URLs darknet://`);
    }
  };

  return (
    <div className="web-browser">
      <div className="web-browser-toolbar">
        <form onSubmit={handleNavigate} className="web-browser-url-form">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="web-browser-url"
            placeholder="darknet://..."
          />
          <button type="submit" className="web-browser-go-btn">→</button>
        </form>
      </div>
      <div className="web-browser-content">
        <pre>{content}</pre>
      </div>
    </div>
  );
}

