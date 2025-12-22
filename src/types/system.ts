export interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  appId?: string;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  component?: string;
}

export interface SystemConfig {
  desktop: {
    icons: DesktopIcon[];
  };
  apps: App[];
  filesystem: Record<string, any>;
  terminal: {
    commands: any[];
  };
  puzzles: any[];
  secrets: any[];
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
