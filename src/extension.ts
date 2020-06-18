// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawnSync, execSync } from "child_process";
import path = require("path");

const OCAMLFORMAT_BIN_NAME = "ocamlformat";

const makeOcamlformatPathUsingOpam = (dir: string) => {
	const cmd = "eval $(opam env --readonly) > /dev/null 2>&1 && /bin/echo -n $OPAM_SWITCH_PREFIX"
	const res = execSync(cmd, {
		cwd: dir
	});
	if (res.length == 0) {
		throw new Error(`the command outputs nothing to stdout: ${cmd}`);
	}
	return `${res}/bin/${OCAMLFORMAT_BIN_NAME}`;
}

const format = (filename: string) => {
	const config = vscode.workspace.getConfiguration("ocamlformat-vscode-extension");

	const ocamlformatPath = <string>config.get('customOcamlformatPath') || makeOcamlformatPathUsingOpam(path.dirname(filename));

	const ocamlformatOptions = (<string>config.get('ocamlformatOption')).split(',');
	const args = ocamlformatOptions.concat(filename);

	return spawnSync(ocamlformatPath, args, {
		cwd: path.dirname(filename)
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ocamlformat-vscode-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ocamlformat-vscode-extension.ocamlformat', () => {
		// The code you place here will be executed every time your command is executed
		const { activeTextEditor } = vscode.window
		if (!activeTextEditor) return
		const { document } = activeTextEditor

		try {
			const res = format(document.fileName);

			if (res.error) {
				vscode.window.showErrorMessage(res.error.message);
			} else {
				if (res.status == 0) {
					vscode.window.showInformationMessage('ocamlformat success!');
				} else {
					vscode.window.showErrorMessage(res.stderr.toString());
				}
			}
		} catch (error) {
			vscode.window.showErrorMessage(error.message);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
