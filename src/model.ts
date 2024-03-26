import type { TerminalOptions } from "vscode";

export interface TerminalConfig {
  commands?: string[];
  name?: string;
  shouldRunCommands?: boolean; //whether to actually run the commands, or just paste them in
}

export interface TerminalWindow {
  splitTerminals?: TerminalConfig[];
}

export interface Configuration {
  keepExistingTerminalsOpen?: boolean;
  artificialDelayMilliseconds?: number;
  terminalWindows?: TerminalWindow[] | Map<string, TerminalWindow[]>;
  runOnStartup?: boolean;
}

export interface JsonConfiguration {
  keepExistingTerminalsOpen?: boolean;
  artificialDelayMilliseconds?: number;
  terminals?: TerminalWindow[]; //uses same type for now
  runOnStartup?: boolean;
}
