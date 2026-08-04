# Change Log

## 1.1.11

- Documented the recommended dedicated-file configuration for multi-root workspaces and Git worktrees.

## 1.1.10

- Added validation and autocomplete for `.vscode/restore-terminals.json` files.
- The dedicated-file schema is generated from the existing Restore Terminals settings schema so both formats stay in sync.

## 1.1.9

- Added a terminal-window `cwd` option with named multi-root workspace-folder resolution.
- Invalid or ambiguous workspace-folder paths now fail before existing terminals are closed.

## 1.1.6

- Added ability to prevent commands running, just pastes them there, as per [this feature request](https://github.com/EthanSK/restore-terminals-vscode/issues/11#issuecomment-834582672).

## [Unreleased]

- Initial release
