
export type TerminalConfig = {
  commands: string[],
  name?: string,
}

export type TerminalWindow = {
  splitTerminals?: TerminalConfig[]
}
