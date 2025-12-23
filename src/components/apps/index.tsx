import TerminalWindow from './TerminalWindow';
import FileManager from './FileManager';
import TextEditor from './TextEditor';
import WebBrowser from './WebBrowser';
import DecryptTool from './DecryptTool';
import TrashViewer from './TrashViewer';

export const AppComponents: Record<string, React.ComponentType<any>> = {
  TerminalWindow,
  FileManager,
  TextEditor,
  WebBrowser,
  DecryptTool,
  TrashViewer,
};

export default AppComponents;

