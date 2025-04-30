import * as vscode from "vscode";
import { delay } from "./utils";
import { Configuration, TerminalConfig, TerminalWindow } from "./model";

const DEFAULT_ARTIFICAL_DELAY = 300;
const SPLIT_TERM_CHECK_DELAY = 100;
const MAX_TERM_CHECK_ATTEMPTS = 500; //this times SPLIT_TERM_CHECK_DELAY is the timeout

export default async function restoreTerminals(configuration: Configuration) {
  console.log("restoring terminals", configuration);
  const {
    keepExistingTerminalsOpen,
    artificialDelayMilliseconds,
    terminalWindows,
  } = configuration;

  if (!terminalWindows) {
    // vscode.window.showInformationMessage("No terminal window configuration provided to restore terminals with.") //this might be annoying
    return;
  }

  if (vscode.window.activeTerminal && !keepExistingTerminalsOpen) {
    vscode.window.terminals.forEach((terminal) => {
      //i think calling terminal.dispose before creating the new termials causes error because the terminal has disappeard and it fux up. we can do it after, and check that the terminal we are deleting is not in the list of terminals we just created
      console.log(`Disposing terminal ${terminal.name}`);
      terminal.dispose();
    });
  }
  await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY); //without delay it starts bugging out

  let commandsToRunInTerms: {
    commands: string[];
    shouldRunCommands: boolean;
    terminal: vscode.Terminal;
  }[] = [];
  //create the terminals sequentially so theres no glitches, but run the commands in parallel
  for (const terminalWindow of terminalWindows) {
    if (!terminalWindow.splitTerminals) {
      // vscode.window.showInformationMessage("No split terminal configuration provided to restore terminals with.") //this might be annoying
      return;
    }

    let term!: vscode.Terminal;
    let name = terminalWindow.splitTerminals[0]?.name;
    let location =
      terminalWindow.location == "view" || terminalWindow.location == "panel"
        ? vscode.TerminalLocation.Panel
        : terminalWindow.location == "editor"
        ? vscode.TerminalLocation.Editor
        : 0;
    let path = terminalWindow.splitTerminals[0]?.path;

    term = vscode.window.createTerminal({
      name: name,
      location: location,
      cwd: path,
    });

    term.show();

    //the first terminal split is already created from when we called createTerminal
    if (terminalWindow.splitTerminals.length > 0) {
      const { commands, shouldRunCommands } = terminalWindow.splitTerminals[0];
      commands &&
        commandsToRunInTerms.push({
          commands,
          shouldRunCommands: shouldRunCommands ?? true,
          terminal: term,
        });
    }

    for (let i = 1; i < terminalWindow.splitTerminals.length; i++) {
      const splitTerminal = terminalWindow.splitTerminals[i];

      let name = splitTerminal.name;
      let path = splitTerminal.path;

      term = vscode.window.createTerminal({
        name: name,
        location: {
          parentTerminal: term,
        },
        cwd: path,
      });

      const { commands, shouldRunCommands } = splitTerminal;
      commands &&
        commandsToRunInTerms.push({
          commands,
          shouldRunCommands: shouldRunCommands ?? true,
          terminal: term,
        });
    }

    await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY);
  }

  //we run the actual commands in parallel
  commandsToRunInTerms.forEach(async (el) => {
    await runCommands(el.commands, el.terminal, el.shouldRunCommands);
  });
}

async function runCommands(
  commands: string[],
  terminal: vscode.Terminal,
  shouldRunCommands: boolean = true
) {
  for (let j = 0; j < commands?.length; j++) {
    const command = commands[j] + (shouldRunCommands ? "" : ";"); //add semicolon so all commands can run properly after user presses enter
    terminal.sendText(command, shouldRunCommands);
  }
}
