'use client';

import { useState, useRef, useEffect } from 'react';
import { SystemConfig, TerminalState } from '@/types/system';
import { executeCommand, createTerminalState, TerminalOutput } from '@/utils/terminal';

interface TerminalWindowProps {
  systemConfig: SystemConfig;
}

export default function TerminalWindow({ systemConfig }: TerminalWindowProps) {
  const [state, setState] = useState<TerminalState>(createTerminalState());
  const [output, setOutput] = useState<TerminalOutput[]>([
    { type: 'output', content: `Bienvenido a ${systemConfig.systemInfo?.name || 'NullOS'}\nEscribe 'help' para ver los comandos disponibles.\n` }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Mostrar el comando ejecutado
    const prompt = `${systemConfig.systemInfo?.hostname || 'user'}@${state.currentPath}$ `;
    
    // Si es el comando clear, limpiar la pantalla
    if (input.trim() === 'clear') {
      setOutput([]);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    setOutput(prev => [...prev, { type: 'output', content: prompt + input }]);

    // Ejecutar el comando
    const result = executeCommand(input, systemConfig, state);
    setOutput(prev => [...prev, ...result.output]);
    setState(result.newState);
    setInput('');

    // Focus en el input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        setState(prev => ({ ...prev, historyIndex: newIndex }));
        setInput(state.history[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.historyIndex < state.history.length) {
        const newIndex = state.historyIndex + 1;
        setState(prev => ({ ...prev, historyIndex: newIndex }));
        setInput(state.history[newIndex] || '');
      }
    }
  };

  const getOutputClassName = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'error':
        return 'terminal-error';
      case 'success':
        return 'terminal-success';
      default:
        return 'terminal-output';
    }
  };

  return (
    <div className="terminal-window">
      <div className="terminal-output-area" ref={outputRef}>
        {output.map((line, index) => (
          <div key={index} className={getOutputClassName(line.type)}>
            {line.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="terminal-input-form">
        <span className="terminal-prompt">
          {systemConfig.systemInfo?.hostname || 'user'}@{state.currentPath}$ 
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          autoFocus
        />
      </form>
    </div>
  );
}

