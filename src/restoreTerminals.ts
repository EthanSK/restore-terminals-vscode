import * as vscode from "vscode";
import { delay } from "./utilts";
import { TerminalConfig, TerminalWindow } from "./model";

const DEFAULT_ARTIFICAL_DELAY = 150;
export default async function restoreTerminals() {
  console.log("restoring terminals");
  // Display a message box to the user
  // vscode.window.showInformationMessage('Restoring terminals'); //TODO:  remove later
  const keepExistingTerminalsOpen:
    | boolean
    | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("keepExistingTerminalsOpen");

  const artificialDelayMilliseconds:
    | number
    | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("artificialDelayMilliseconds");

  const terminalWindows:
    | TerminalWindow[]
    | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("terminals");

  if (!terminalWindows) {
    // vscode.window.showInformationMessage("No terminal window configuration provided to restore terminals with.") //this might be annoying
    return;
  }

  if (vscode.window.activeTerminal && !keepExistingTerminalsOpen) {
    vscode.window.terminals.forEach((terminal) => {
      //i think calling terminal.dispose before creating the new termials causes error because the terminal has disappeard and it fux up. we can do it after, and check that the terminal we are deleting is not in the list of terminals we just created
      console.log(`disposing terminal ${terminal.name}`);
      terminal.dispose(); //TODO: - make this an option, have it on by default
    });
  }
  await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY); //without delay it starts bugging out

  let commandsToRunInTerms: {
    commands: string[];
    terminal: vscode.Terminal;
  }[] = [];
  //create the terminals sequentially so theres no glitches, but run the commands in parallel
  for (const terminalWindow of terminalWindows) {
    if (!terminalWindow.splitTerminals) {
      // vscode.window.showInformationMessage("No split terminal configuration provided to restore terminals with.") //this might be annoying
      return;
    }
    const term = vscode.window.createTerminal({
      name: terminalWindow.splitTerminals[0]?.name,
      //  cwd: vscode.window.activeTextEditor?.document.uri.fsPath, //i think this happens by default
    });
    term.show();
    await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY);
    //the first terminal split is already created from when we called createTerminal
    if (terminalWindow.splitTerminals.length > 0) {
      const commands = terminalWindow.splitTerminals[0].commands;
      commandsToRunInTerms.push({
        commands,
        terminal: term,
      });
    }
    for (let i = 1; i < terminalWindow.splitTerminals.length; i++) {
      const splitTerminal = terminalWindow.splitTerminals[i];
      const createdSplitTerm = await createNewSplitTerminal(splitTerminal.name);
      const commands = splitTerminal.commands;
      commandsToRunInTerms.push({
        commands,
        terminal: createdSplitTerm,
      });
    }
  }

  //we run the actual commands in parallel
  commandsToRunInTerms.forEach(async (el) => {
    await runCommands(el.commands, el.terminal);
  });
}

async function runCommands(commands: string[], terminal: vscode.Terminal) {
  for (let j = 0; j < commands.length; j++) {
    const command = commands[j];
    terminal.sendText(command);
  }
}

async function createNewSplitTerminal(
  name: string | undefined
): Promise<vscode.Terminal> {
  return new Promise(async (resolve, reject) => {
    await vscode.commands.executeCommand("workbench.action.terminal.split");
    if (name) {
      await vscode.commands.executeCommand(
        "workbench.action.terminal.renameWithArg",
        {
          name,
        }
      );
    }

    vscode.window.onDidChangeActiveTerminal((terminal) => {
      if (terminal) {
        resolve(terminal);
      }
    });
  });
}
