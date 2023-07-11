"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const helpers_1 = require("./helpers");
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    const persist = helpers_1.workspace.persist();
    const input = await (0, enquirer_1.prompt)([
        {
            type: 'input',
            name: 'vendorName',
            message: 'What is vendor/company name?',
            initial: persist.get('vendorName', '...'),
            format(value) {
                return value.toLowerCase();
            },
            validate: (value) => {
                return /^\w+$/.test(value) ? true : "Contain alpha numeric characters";
            }
        },
        {
            type: 'input',
            name: 'appName',
            message: 'What is app name?',
            initial: persist.get('appName', '...'),
            format(value) {
                return value.toLowerCase();
            },
            validate: (value) => {
                return /^\w+$/.test(value) ? true : "Contain alpha numeric characters";
            }
        }
    ]);
    const { vendorName, appName } = input;
    console.log(chalk_1.default.green("Generating files ..."));
    const workingDir = process.cwd();
    const packageName = `@${vendorName}/${appName}`;
    const realpathToApp = `${workingDir}/packages/${vendorName}/${appName}`;
    (0, fs_extra_1.copySync)(`${path_1.default.dirname(__dirname)}/templates/base-app`, realpathToApp);
    helpers_1.workspace.replaceSourceInDir(realpathToApp, {
        appName,
        vendorName,
        packageName,
    });
    persist.save(input);
    helpers_1.workspace.bootstrap();
    helpers_1.workspace.reload();
    console.log(chalk_1.default.cyanBright(`Generated ${packageName} located at .${realpathToApp.substring(workingDir.length)}`));
    console.log(chalk_1.default.bold.cyanBright(`Restart frontend terminal to apply changes.`));
}
exports.default = main;
