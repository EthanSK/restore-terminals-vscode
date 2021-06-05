export interface TerminalConfig {
  commands?: string[];
  name?: string;
  shouldRunCommands?: boolean; //whether to actually run the commands, or just paste them in
  cwd?: string;
}

export interface TerminalWindow {
  splitTerminals?: TerminalConfig[];
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
