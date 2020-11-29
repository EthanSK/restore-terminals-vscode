import * as vscode from 'vscode'
import * as path from 'path'
import { TextDecoder } from 'text-encoding'
import { TerminalWindow } from './model'

interface IConfiguration {
  shouldRunOnStartup: boolean
  keepExistingTerminalsOpen: boolean
  artificialDelayMilliseconds: number
  terminalWindows: TerminalWindow[]
}

interface IOptionalConfiguration {
  shouldRunOnStartup?: boolean
  keepExistingTerminalsOpen?: boolean
  artificialDelayMilliseconds?: number
  terminals?: TerminalWindow[]
}

const valuesWithDefaults = (
  optionalConfigurations: IOptionalConfiguration = {}
): IConfiguration => {
  const {
    shouldRunOnStartup = false,
    keepExistingTerminalsOpen = false,
    artificialDelayMilliseconds = 150,
    terminals = []
  } = optionalConfigurations
  return {
    shouldRunOnStartup,
    keepExistingTerminalsOpen,
    artificialDelayMilliseconds,
    terminalWindows: terminals
  }
}

const openFile = async (openPath?: vscode.Uri) => {
  if (!openPath) {
    return undefined
  }
  try {
    const fileData = await vscode.workspace.fs.readFile(openPath)
    return fileData
  } catch (err) {
    // Means there is no file so no error message shown
    return undefined
  }
}

const getConfigurationFromFile = async (): Promise<
  IConfiguration | undefined
> => {
  const { rootPath } = vscode.workspace

  if (!rootPath) {
    return undefined
  }

  const filePath = path.join(rootPath, '.vscode', 'restore-terminals.json')
  const openPath = vscode.Uri.file(filePath)

  try {
    const fileData = await openFile(openPath)

    if (!fileData) {
      return undefined
    }

    const fileDataString = new TextDecoder('utf-8').decode(fileData)
    // TODO: should validate file format
    const fileDataJson = JSON.parse(fileDataString) as IOptionalConfiguration
    vscode.window.showInformationMessage('Getting configuration from file.')
    return valuesWithDefaults(fileDataJson)
  } catch (err) {
    vscode.window.showErrorMessage(
      'Error parsing configuration file. Using global configurations.'
    )
    return undefined
  }
}

const getConfigurationFromSettings = async () => {
  const keepExistingTerminalsOpen:
    | boolean
    | undefined = vscode.workspace
    .getConfiguration('restoreTerminals')
    .get('keepExistingTerminalsOpen')

  const artificialDelayMilliseconds:
    | number
    | undefined = vscode.workspace
    .getConfiguration('restoreTerminals')
    .get('artificialDelayMilliseconds')

  const terminals:
    | TerminalWindow[]
    | undefined = vscode.workspace
    .getConfiguration('restoreTerminals')
    .get('terminals')

  return valuesWithDefaults({
    shouldRunOnStartup: getShouldRunOnStartup(),
    keepExistingTerminalsOpen,
    artificialDelayMilliseconds,
    terminals
  })
}

export const getConfiguration = async (): Promise<IConfiguration> => {
  const fileConfiguration = await getConfigurationFromFile()

  if (fileConfiguration) {
    return fileConfiguration
  } else {
    return getConfigurationFromSettings()
  }
}

// Let's keep this separated until there is a way to make activate() function async.
export const getShouldRunOnStartup = (): boolean | undefined =>
  vscode.workspace.getConfiguration('restoreTerminals').get('runOnStartup')
