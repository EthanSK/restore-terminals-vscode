/* eslint-disable prettier/prettier */
import type { TerminalOptions } from "vscode";

export interface TerminalConfig {
    commands?: string[];
    name?: string;
    shouldRunCommands?: boolean; //whether to actually run the commands, or just paste them in
}

export interface TerminalWindow {
    name?: string;
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
