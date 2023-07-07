"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
const chalk_1 = __importDefault(require("chalk"));
async function main() {
    const persist = helpers_1.workspace.persist();
    const input = await (0, enquirer_1.prompt)([
        {
            type: 'input',
            name: 'vendorName',
            message: 'What is your vendor/company name?',
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
            name: 'themeId',
            message: 'What is theme id?',
            initial: persist.get('themeId', '...'),
            format(value) {
                return value.toLowerCase();
            },
            validate: (value) => {
                return /^\w+$/.test(value) ? true : "Contain alpha numeric characters";
            }
        }
    ]);
    console.log(chalk_1.default.green(`Generating theme files`));
    const workingDir = process.cwd();
    const { themeId, vendorName } = input;
    const packageName = `@${vendorName}/theme-${themeId}`;
    input.packageName = packageName;
    const srcTheme = path_1.default.dirname(__dirname) + `/templates/base-theme`;
    const srcStyle = path_1.default.dirname(__dirname) + `/templates/base-theme-variant`;
    const realpathToTheme = `${workingDir}/packages/${vendorName}/theme-${themeId}`;
    const styleId = `${themeId}x0`;
    const realpathToStyle = `${realpathToTheme}/src/styles/${styleId}`;
    (0, fs_1.mkdirSync)(realpathToTheme, { recursive: true });
    (0, fs_extra_1.copySync)(srcTheme, realpathToTheme, { overwrite: true });
    (0, fs_extra_1.copySync)(srcStyle, realpathToStyle, { overwrite: true });
    // replace all files by token
    helpers_1.workspace.replaceSourceInDir(realpathToTheme, {
        packageName,
        themeId,
        styleId
    });
    // update develop
    helpers_1.workspace.updateEnv({
        'MFOX_SITE_THEME': `"${themeId}:${styleId}"`
    });
    persist.save(input);
    helpers_1.workspace.enablePackage(packageName);
    helpers_1.workspace.bootstrap();
    helpers_1.workspace.reload();
    console.log(chalk_1.default.green(`Generated theme ${themeId} located at .${realpathToTheme.substring(workingDir.length)}`));
    console.log(chalk_1.default.bold.cyanBright(`Restart frontend terminal to apply ${themeId} theme`));
}
exports.default = main;
