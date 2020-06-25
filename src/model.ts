
export type TerminalConfig = {
  commandToRun: string
}

export type TerminalWindow = {
  terminalName?: string,
  splitTerminals: TerminalConfig[]
}