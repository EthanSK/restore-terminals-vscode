import * as vscode from 'vscode';
import { delay } from './utilts';


export default async function restoreTerminals() {

  // Display a message box to the user
  // vscode.window.showInformationMessage('Restoring terminals'); //TODO:  remove later

  if (vscode.window.activeTerminal) {
    await delay(2000)
    // vscode.window.activeTerminal?.dispose()
    vscode.window.terminals.forEach(terminal => {

      //i think calling terminal.dispose before creating the new termials causes error because the terminal has disappeard and it fux up. we can do it after, and check that the terminal we are deleting is not in the list of terminals we just created 
      console.log(`disposing terminal ${terminal.name}`)
      terminal.dispose() //TODO: - make this an option, have it on by default

    })
  }

  vscode.window.createTerminal({
    name: "test name boi",
    // cwd: vscode.window.activeTextEditor?.document.uri.fsPath, //i think this happens by default
  })

  // vscode.window.createTerminal({
  //   name: "2222",
  //   // cwd: vscode.window.activeTextEditor?.document.uri.fsPath, //i think this happens by default
  // })
  await delay(2000)

  vscode.window.terminals.forEach(terminal => {
    terminal.show()
    terminal.sendText(`echo "hello poo"`)
  })

  await delay(2000)
  const split = await createNewSplitTerminal()
  split.sendText("yeeet")

  const split2 = await createNewSplitTerminal()
  split2.sendText("yote")

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