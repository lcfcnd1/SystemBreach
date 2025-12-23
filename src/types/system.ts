export interface SystemInfo {
  name: string;
  version: string;
  hostname: string;
}

export interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  appId?: string;
  openFile?: string;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  component?: string;
  allowMultiple?: boolean;
  hidden?: boolean;
}

export interface FileSystemNode {
  type: 'file' | 'directory';
  content?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    execute?: boolean;
  };
  metadata?: Record<string, any>;
  children?: Record<string, FileSystemNode>;
}

export interface TerminalCommand {
  name: string;
  description: string;
  handler: string;
  args: string[];
}

export interface SystemConfig {
  systemInfo?: SystemInfo;
  desktop: {
    background?: string;
    theme?: string;
    icons: DesktopIcon[];
  };
  apps: App[];
  filesystem: {
    root: FileSystemNode;
  };
  terminal: {
    commands: TerminalCommand[];
  };
  puzzles?: Record<string, any>;
  secrets?: Record<string, any>;
}

export interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  content: React.ReactNode;
}
