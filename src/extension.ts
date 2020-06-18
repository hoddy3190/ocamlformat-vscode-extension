// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawnSync, execSync } from "child_process";
import path = require("path");

const OCAMLFORMAT_BIN_NAME = "ocamlformat";

const makeOcamlformatPathUsingOpam = (dir: string) => {
	const res = execSync("eval $(opam env --readonly) > /dev/null 2>&1 && /bin/echo -n $OPAM_SWITCH_PREFIX", {
		cwd: dir
	});
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
		const res = format(document.fileName);
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ocamlformat-vscode-extension!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
