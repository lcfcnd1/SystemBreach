import { FileSystemNode } from '@/types/system';

export interface FileSystemPath {
  path: string;
  node: FileSystemNode | null;
  exists: boolean;
  error?: string;
}

/**
 * Navega por el sistema de archivos y retorna el nodo en la ruta especificada
 */
export function navigateFilesystem(
  filesystem: { root: FileSystemNode },
  path: string
): FileSystemPath {
  // Normalizar la ruta
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const parts = normalizedPath.split('/').filter(p => p !== '');

  let current: FileSystemNode | null = filesystem.root;

  // Si la ruta es solo "/", retornar root
  if (parts.length === 0) {
    return {
      path: '/',
      node: current,
      exists: true
    };
  }

  // Navegar por las partes de la ruta
  for (const part of parts) {
    if (!current || current.type !== 'directory') {
      return {
        path: normalizedPath,
        node: null,
        exists: false,
        error: 'Not a directory'
      };
    }

    if (!current.children || !current.children[part]) {
      return {
        path: normalizedPath,
        node: null,
        exists: false,
        error: 'Path not found'
      };
    }

    current = current.children[part];
  }

  return {
    path: normalizedPath,
    node: current,
    exists: true
  };
}

/**
 * Lee el contenido de un archivo
 */
export function readFile(
  filesystem: { root: FileSystemNode },
  path: string
): { content: string | null; error?: string; permissions?: { read: boolean; write: boolean } } {
  const result = navigateFilesystem(filesystem, path);

  if (!result.exists || !result.node) {
    return { content: null, error: result.error || 'File not found' };
  }

  if (result.node.type !== 'file') {
    return { content: null, error: 'Not a file' };
  }

  // Verificar permisos
  const permissions = result.node.permissions || { read: true, write: false };
  if (!permissions.read) {
    return { 
      content: null, 
      error: 'Permission denied',
      permissions 
    };
  }

  return {
    content: result.node.content || '',
    permissions
  };
}

/**
 * Lista el contenido de un directorio
 */
export function listDirectory(
  filesystem: { root: FileSystemNode },
  path: string
): { entries: Array<{ name: string; type: 'file' | 'directory' }>; error?: string } {
  const result = navigateFilesystem(filesystem, path);

  if (!result.exists || !result.node) {
    return { entries: [], error: result.error || 'Directory not found' };
  }

  if (result.node.type !== 'directory') {
    return { entries: [], error: 'Not a directory' };
  }

  // Verificar permisos de lectura
  const permissions = result.node.permissions || { read: true, write: false };
  if (!permissions.read) {
    return { entries: [], error: 'Permission denied' };
  }

  const entries: Array<{ name: string; type: 'file' | 'directory' }> = [];

  if (result.node.children) {
    for (const [name, node] of Object.entries(result.node.children)) {
      entries.push({
        name,
        type: node.type
      });
    }
  }

  return { entries };
}

/**
 * Resuelve una ruta relativa a partir de un directorio actual
 */
export function resolvePath(currentPath: string, targetPath: string): string {
  // Si es una ruta absoluta, retornarla tal cual
  if (targetPath.startsWith('/')) {
    return targetPath;
  }

  // Normalizar el path actual
  const current = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
  if (current === '') currentPath = '/';

  // Manejar .. y .
  const parts = targetPath.split('/');
  const currentParts = current.split('/').filter(p => p !== '');

  for (const part of parts) {
    if (part === '..') {
      if (currentParts.length > 0) {
        currentParts.pop();
      }
    } else if (part !== '.' && part !== '') {
      currentParts.push(part);
    }
  }

  return '/' + currentParts.join('/');
}

