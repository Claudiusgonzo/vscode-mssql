/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import vscode = require('vscode');
import Constants = require('./constants/constants');
import * as LocalizedConstants from './constants/localizedConstants';
import MainController from './controllers/mainController';
import VscodeWrapper from './controllers/vscodeWrapper';

let controller: MainController = undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<boolean> {
    let vscodeWrapper = new VscodeWrapper();
    controller = new MainController(context, undefined, vscodeWrapper);
    context.subscriptions.push(controller);

    // Checking if localization should be applied
    let config = vscodeWrapper.getConfiguration(Constants.extensionConfigSectionName);
    let applyLocalization = config[Constants.configApplyLocalization];
    if (applyLocalization) {
        LocalizedConstants.loadLocalizedConstants(vscode.env.language);
    }

    // Exposed for testing purposes
    vscode.commands.registerCommand('mssql.getControllerForTests', () => controller);
    const activated = await controller.activate();
    return activated;
}

// this method is called when your extension is deactivated
export async function deactivate(): Promise<void> {
    if (controller) {
        await controller.deactivate();
        controller.dispose();
    }
}

/**
 * Exposed for testing purposes
 */
export async function getController(): Promise<MainController> {
    if (!controller) {
        let savedController: MainController = await vscode.commands.executeCommand('mssql.getControllerForTests');
        return savedController;
    }
    return controller;
}
