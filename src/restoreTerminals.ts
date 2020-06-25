import * as vscode from 'vscode';
import { delay } from './utilts';
import { TerminalConfig, TerminalWindow } from './model';


export default async function restoreTerminals() {

  // Display a message box to the user
  // vscode.window.showInformationMessage('Restoring terminals'); //TODO:  remove later

  const terminalWindows: TerminalWindow[] | undefined = vscode.workspace.getConfiguration("restoreTerminals").get("terminals")
  if (!terminalWindows) {
    // vscode.window.showInformationMessage("No terminal window configuration provided to restore terminals with.") //this might be annoying
    return
  }

  if (vscode.window.activeTerminal) {
    // await delay(2000)
    // vscode.window.activeTerminal?.dispose()
    vscode.window.terminals.forEach(terminal => {

      //i think calling terminal.dispose before creating the new termials causes error because the terminal has disappeard and it fux up. we can do it after, and check that the terminal we are deleting is not in the list of terminals we just created 
      console.log(`disposing terminal ${terminal.name}`)
      terminal.dispose() //TODO: - make this an option, have it on by default

    })
  }
  await delay(2000)

  for (const terminalWindow of terminalWindows) {
    if (!terminalWindow.splitTerminals) {
      // vscode.window.showInformationMessage("No split terminal configuration provided to restore terminals with.") //this might be annoying
      return
    }
    const term = vscode.window.createTerminal({
      // name: "yes" //don't set it, make it set depending on the split terminals
      //  cwd: vscode.window.activeTextEditor?.document.uri.fsPath, //i think this happens by default
    })
    term.show()
    // await delay(500)

    //the first terminal split is already created from when we called createTerminal
    if (terminalWindow.splitTerminals.length > 0) {
      term.sendText(terminalWindow.splitTerminals[0].commandToRun)
    }
    for (let i = 1; i < terminalWindow.splitTerminals.length; i++) {
      const splitTerminal = terminalWindow.splitTerminals[i];
      const createdSplitTerm = await createNewSplitTerminal()
      createdSplitTerm.sendText(splitTerminal.commandToRun)
      await delay(500)

    }
  }
}

async function createNewSplitTerminal(): Promise<vscode.Terminal> {
  return new Promise(async (resolve, reject) => {
    await vscode.commands.executeCommand("workbench.action.terminal.split");

    vscode.window.onDidChangeActiveTerminal((terminal) => {
      if (terminal) {
        resolve(terminal);
      }
    });
  });
}