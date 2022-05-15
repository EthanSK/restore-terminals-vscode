export enum TerminalColor {
  "black" = "terminal.ansiBlack",
  "red" = "terminal.ansiRed",
  "green" = "terminal.ansiGreen",
  "yellow" = "terminal.ansiYellow",
  "blue" = "terminal.ansiBlue",
  "magenta" = "terminal.ansiMagenta",
  "cyan" = "terminal.ansiCyan",
  "white" = "terminal.ansiWhite",
}

export interface TerminalConfig {
  commands?: string[];
  name?: string;
  color?: keyof typeof TerminalColor;
  shouldRunCommands?: boolean; //whether to actually run the commands, or just paste them in
}

export interface TerminalWindow {
  splitTerminals?: TerminalConfig[];
  profile?: string;
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
