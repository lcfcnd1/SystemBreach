'use client';

import { useState } from 'react';
import { SystemConfig } from '@/types/system';

interface DecryptToolProps {
  systemConfig: SystemConfig;
}

export default function DecryptTool({ systemConfig }: DecryptToolProps) {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDecrypt = () => {
    if (!hash.trim()) {
      setResult('Error: Ingresa un hash para descifrar');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Simular procesamiento
    setTimeout(() => {
      // Buscar en el sistema de archivos
      const shadowBackup = systemConfig.filesystem.root.children?.var?.children?.backups?.children?.['shadow_backup.old'];
      const backupContent = shadowBackup?.content || '';

      if (backupContent.includes(hash)) {
        // Buscar la solución en puzzles
        const puzzle = systemConfig.puzzles?.['puzzle_01_login'];
        if (puzzle?.solution) {
          setResult(`✓ Hash descifrado exitosamente!\n\nContraseña: ${puzzle.solution}`);
        } else {
          setResult('Hash encontrado pero no se pudo descifrar completamente.');
        }
      } else {
        setResult('✗ Hash no encontrado en la base de datos.\nIntenta con otro hash.');
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="decrypt-tool">
      <div className="decrypt-tool-header">
        <h3>HashBreaker v1</h3>
        <p>Herramienta de descifrado de hashes</p>
      </div>
      <div className="decrypt-tool-input">
        <label>Hash a descifrar:</label>
        <textarea
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="Pega el hash aquí..."
          className="decrypt-tool-textarea"
        />
        <button 
          onClick={handleDecrypt} 
          disabled={isProcessing || !hash.trim()}
          className="decrypt-tool-btn"
        >
          {isProcessing ? 'Procesando...' : 'Descifrar'}
        </button>
      </div>
      {result && (
        <div className="decrypt-tool-result">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

