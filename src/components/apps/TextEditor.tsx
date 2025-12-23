'use client';

import { useState, useEffect } from 'react';
import { SystemConfig } from '@/types/system';
import { readFile } from '@/utils/filesystem';

interface TextEditorProps {
  systemConfig: SystemConfig;
  initialFile?: string;
}

export default function TextEditor({ systemConfig, initialFile }: TextEditorProps) {
  const [content, setContent] = useState('');
  const [filePath, setFilePath] = useState(initialFile || '');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (initialFile) {
      loadFile(initialFile);
    }
  }, [initialFile]);

  const loadFile = (path: string) => {
    const result = readFile(systemConfig.filesystem, path);
    if (result.error) {
      setContent(`Error: ${result.error}`);
    } else {
      setContent(result.content || '');
      setFilePath(path);
      setIsModified(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // En una implementación real, aquí se guardaría el archivo
    // Por ahora solo marcamos como no modificado
    setIsModified(false);
    // TODO: Implementar guardado de archivos
  };

  return (
    <div className="text-editor">
      <div className="text-editor-toolbar">
        <span className="text-editor-path">{filePath || 'Sin título'}</span>
        {isModified && <span className="text-editor-modified">●</span>}
        {filePath && (
          <button onClick={handleSave} className="text-editor-save-btn" disabled={!isModified}>
            Guardar
          </button>
        )}
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="text-editor-content"
        placeholder="Escribe aquí o abre un archivo..."
        spellCheck={false}
      />
    </div>
  );
}

