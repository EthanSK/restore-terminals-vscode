
export type TerminalConfig = {
  commands: string[]
}

export type TerminalWindow = {
  // terminalName?: string, //i don't think this do shit. we have split terminals, what does it even mean to name one of them
  splitTerminals?: TerminalConfig[]
}
