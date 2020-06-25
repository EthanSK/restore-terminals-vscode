import * as vscode from 'vscode';


export default function restoreTerminals() {

  // Display a message box to the user
  vscode.window.showInformationMessage('Restoring terminals'); //TODO:  remove later
  vscode.window.createTerminal({
    name: "test name boi",
    // cwd: vscode.window.activeTextEditor?.document.uri.fsPath, //i think this happens by default
    shellArgs: [
      "echo",
      `"poo"`
    ]
  })

  vscode.window.terminals.forEach(terminal => terminal.show())

}