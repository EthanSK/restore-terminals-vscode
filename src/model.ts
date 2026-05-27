import type { TerminalOptions } from "vscode";

export interface TerminalConfig {
  commands?: string[];
  name?: string;
  shouldRunCommands?: boolean; //whether to actually run the commands, or just paste them in
  cwd?: string; //working directory relative to workspace folder
}

export interface TerminalWindow {
  splitTerminals?: TerminalConfig[];
  workspaceFolderPath?: string; // Path to the workspace folder this config belongs to (for multi-root workspaces)
}

export interface Configuration {
  keepExistingTerminalsOpen?: boolean;
  artificialDelayMilliseconds?: number;
  terminalWindows?: TerminalWindow[];
  runOnStartup?: boolean;
}

export interface JsonConfiguration {
  keepExistingTerminalsOpen?: boolean;
  artificialDelayMilliseconds?: number;
  terminals?: TerminalWindow[]; //uses same type for now
  runOnStartup?: boolean;
}
