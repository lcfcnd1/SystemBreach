'use client';

import { useState } from 'react';
import { SystemConfig } from '@/types/system';
import { listDirectory, navigateFilesystem, readFile, resolvePath } from '@/utils/filesystem';

interface FileManagerProps {
  systemConfig: SystemConfig;
  initialPath?: string;
}

export default function FileManager({ systemConfig, initialPath }: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState(initialPath || '/home/guest');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const result = listDirectory(systemConfig.filesystem, currentPath);
  const pathResult = navigateFilesystem(systemConfig.filesystem, currentPath);

  const handleFileClick = (name: string) => {
    const filePath = resolvePath(currentPath, name);
    const fileResult = readFile(systemConfig.filesystem, filePath);

    if (fileResult.error) {
      setFileContent(`Error: ${fileResult.error}`);
    } else {
      setSelectedFile(filePath);
      setFileContent(fileResult.content || '');
    }
  };

  const handleDirectoryClick = (name: string) => {
    const newPath = resolvePath(currentPath, name);
    setCurrentPath(newPath);
    setSelectedFile(null);
    setFileContent(null);
  };

  const handlePathClick = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
    setFileContent(null);
  };

  const navigateUp = () => {
    const parts = currentPath.split('/').filter(p => p !== '');
    if (parts.length > 0) {
      parts.pop();
      setCurrentPath('/' + parts.join('/'));
    } else {
      setCurrentPath('/');
    }
    setSelectedFile(null);
    setFileContent(null);
  };

  return (
    <div className="file-manager">
      <div className="file-manager-toolbar">
        <button onClick={navigateUp} className="file-manager-btn" disabled={currentPath === '/'}>
          ↑
        </button>
        <input
          type="text"
          value={currentPath}
          onChange={(e) => setCurrentPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePathClick(currentPath);
            }
          }}
          className="file-manager-path"
        />
      </div>
      <div className="file-manager-content">
        <div className="file-manager-sidebar">
          {result.error ? (
            <div className="file-manager-error">{result.error}</div>
          ) : (
            <div className="file-manager-list">
              {result.entries.map((entry) => (
                <div
                  key={entry.name}
                  className={`file-manager-item ${entry.type === 'directory' ? 'directory' : 'file'} ${selectedFile === resolvePath(currentPath, entry.name) ? 'selected' : ''}`}
                  onClick={() => entry.type === 'directory' ? handleDirectoryClick(entry.name) : handleFileClick(entry.name)}
                  onDoubleClick={() => entry.type === 'file' && handleFileClick(entry.name)}
                >
                  <span className="file-manager-icon">
                    {entry.type === 'directory' ? '📁' : '📄'}
                  </span>
                  <span className="file-manager-name">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {fileContent !== null && (
          <div className="file-manager-preview">
            <div className="file-manager-preview-header">
              <span>{selectedFile}</span>
            </div>
            <div className="file-manager-preview-content">
              <pre>{fileContent}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

