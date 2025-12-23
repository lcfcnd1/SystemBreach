import { SystemConfig } from '@/types/system';
import { navigateFilesystem, readFile, listDirectory, resolvePath } from './filesystem';

export interface TerminalOutput {
  type: 'output' | 'error' | 'success';
  content: string;
}

export interface TerminalState {
  currentPath: string;
  history: string[];
  historyIndex: number;
}

/**
 * Ejecuta un comando de terminal
 */
export function executeCommand(
  command: string,
  systemConfig: SystemConfig,
  terminalState: TerminalState
): { output: TerminalOutput[]; newState: TerminalState } {
  const parts = command.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') {
    return {
      output: [],
      newState: terminalState
    };
  }

  const [cmd, ...args] = parts;
  const commandDef = systemConfig.terminal.commands.find(c => c.name === cmd);

  if (!commandDef) {
    return {
      output: [{
        type: 'error',
        content: `Comando no encontrado: ${cmd}. Escribe 'help' para ver los comandos disponibles.`
      }],
      newState: {
        ...terminalState,
        history: [...terminalState.history, command],
        historyIndex: terminalState.history.length + 1
      }
    };
  }

  // Ejecutar el handler correspondiente
  const handler = getCommandHandler(commandDef.handler);
  const result = handler(args, systemConfig, terminalState);

  return {
    output: result.output,
    newState: {
      ...terminalState,
      currentPath: result.newPath || terminalState.currentPath,
      history: [...terminalState.history, command],
      historyIndex: terminalState.history.length + 1
    }
  };
}

/**
 * Obtiene el handler de un comando
 */
function getCommandHandler(handlerName: string) {
  const handlers: Record<string, (args: string[], config: SystemConfig, state: TerminalState) => {
    output: TerminalOutput[];
    newPath?: string;
  }> = {
    helpHandler: (args, config) => {
      const commands = config.terminal.commands;
      const helpText = commands.map(cmd => 
        `  ${cmd.name.padEnd(12)} - ${cmd.description}`
      ).join('\n');
      
      return {
        output: [{
          type: 'output',
          content: `Comandos disponibles:\n${helpText}`
        }]
      };
    },

    lsHandler: (args, config, state) => {
      const targetPath = args[0] ? resolvePath(state.currentPath, args[0]) : state.currentPath;
      const result = listDirectory(config.filesystem, targetPath);

      if (result.error) {
        return {
          output: [{
            type: 'error',
            content: `ls: ${result.error}`
          }]
        };
      }

      if (result.entries.length === 0) {
        return {
          output: [{
            type: 'output',
            content: ''
          }]
        };
      }

      const entries = result.entries.map(e => e.name).join('  ');
      return {
        output: [{
          type: 'output',
          content: entries
        }]
      };
    },

    cdHandler: (args, config, state) => {
      if (args.length === 0) {
        return {
          output: [],
          newPath: '/'
        };
      }

      const targetPath = resolvePath(state.currentPath, args[0]);
      const result = navigateFilesystem(config.filesystem, targetPath);

      if (!result.exists || !result.node) {
        return {
          output: [{
            type: 'error',
            content: `cd: ${result.error || 'No such file or directory'}`
          }]
        };
      }

      if (result.node.type !== 'directory') {
        return {
          output: [{
            type: 'error',
            content: `cd: ${targetPath}: Not a directory`
          }]
        };
      }

      return {
        output: [],
        newPath: targetPath
      };
    },

    catHandler: (args, config, state) => {
      if (args.length === 0) {
        return {
          output: [{
            type: 'error',
            content: 'cat: falta el nombre del archivo'
          }]
        };
      }

      const filePath = resolvePath(state.currentPath, args[0]);
      const result = readFile(config.filesystem, filePath);

      if (result.error || result.content === null) {
        return {
          output: [{
            type: 'error',
            content: `cat: ${result.error || 'No such file'}`
          }]
        };
      }

      return {
        output: [{
          type: 'output',
          content: result.content
        }]
      };
    },

    pwdHandler: (args, config, state) => {
      return {
        output: [{
          type: 'output',
          content: state.currentPath
        }]
      };
    },

    sshHandler: (args, config, state) => {
      if (args.length === 0) {
        return {
          output: [{
            type: 'error',
            content: 'ssh: falta el destino (user@host)'
          }]
        };
      }

      const target = args[0];
      const match = target.match(/^(\w+)@([\w.]+)$/);

      if (!match) {
        return {
          output: [{
            type: 'error',
            content: `ssh: formato inválido. Usa: user@host`
          }]
        };
      }

      const [, user, host] = match;

      // Verificar si hay un puzzle relacionado
      const puzzle = config.puzzles?.['puzzle_02_server'];
      if (puzzle && puzzle.targetIP === host) {
        return {
          output: [{
            type: 'output',
            content: `Conectando a ${host} como ${user}...\n[CONEXIÓN ESTABLECIDA]\nBienvenido al servidor de base de datos.`
          }]
        };
      }

      return {
        output: [{
          type: 'output',
          content: `Conectando a ${host} como ${user}...\n[CONEXIÓN ESTABLECIDA]`
        }]
      };
    },

    scanHandler: (args, config, state) => {
      if (args.length === 0) {
        return {
          output: [{
            type: 'error',
            content: 'scan: falta el objetivo'
          }]
        };
      }

      const target = args[0];
      
      return {
        output: [{
          type: 'output',
          content: `Escaneando ${target}...\n[22/tcp] SSH - Open\n[80/tcp] HTTP - Open\n[443/tcp] HTTPS - Open`
        }]
      };
    },

    crackHandler: (args, config, state) => {
      if (args.length === 0) {
        return {
          output: [{
            type: 'error',
            content: 'crack: falta el hash'
          }]
        };
      }

      const hash = args[0];
      
      // Verificar si el hash está en el sistema
      const shadowBackup = readFile(config.filesystem, '/var/backups/shadow_backup.old');
      if (shadowBackup.content && shadowBackup.content.includes(hash)) {
        // Buscar la solución en el puzzle
        const puzzle = config.puzzles?.['puzzle_01_login'];
        if (puzzle && puzzle.solution) {
          return {
            output: [{
              type: 'success',
              content: `Hash crackeado exitosamente!\nContraseña: ${puzzle.solution}`
            }]
          };
        }
      }

      return {
        output: [{
          type: 'output',
          content: `Intentando crackear hash...\n[Procesando...]\nNo se encontró coincidencia en la base de datos.`
        }]
      };
    },

    clearHandler: (args, config, state) => {
      return {
        output: [{
          type: 'output',
          content: '\x1b[2J\x1b[H' // ANSI escape codes para limpiar pantalla
        }]
      };
    }
  };

  return handlers[handlerName] || (() => ({
    output: [{
      type: 'error',
      content: `Handler no implementado: ${handlerName}`
    }]
  }));
}

/**
 * Inicializa el estado de la terminal
 */
export function createTerminalState(): TerminalState {
  return {
    currentPath: '/home/guest',
    history: [],
    historyIndex: 0
  };
}

