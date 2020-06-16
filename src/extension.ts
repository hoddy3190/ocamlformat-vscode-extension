// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawnSync } from "child_process";
import path = require("path");

const format = (filename: string) => {
	const config = vscode.workspace.getConfiguration("ocamlformat-vscode-extension");

	if (config.get('evalOpamEnv')) {
		const res = spawnSync("eval $(opam env --readonly)", [], {
			cwd: path.dirname(filename)
		});
	}

	const ocamlformatPath = config.get('ocamlformatPath');
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
