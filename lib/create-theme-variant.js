"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
async function main() {
    const persist = helpers_1.workspace.persist();
    const input = await (0, enquirer_1.prompt)([
        {
            type: 'input',
            name: 'packageName',
            message: 'Add to package name',
            initial: persist.get('packageName', '...'),
            format(value) {
                return value.toLowerCase();
            }
        }
    ]);
    persist.save(input);
    const { packageName } = input;
    const { packageJson, realpathToPackage } = helpers_1.workspace.getPackageInfo(packageName);
    const srcStyle = path_1.default.dirname(__dirname) + `/templates/base-theme-variant`;
    const themeId = packageJson?.metafox?.theme;
    if (!themeId) {
        // there are no theme id?
        throw new Error("package may not a theme?");
    }
    const styleId = (() => {
        for (let i = 0; i < 100; ++i) {
            if (!(0, fs_1.existsSync)(`${realpathToPackage}/src/styles/${themeId}x${i}`)) {
                return `${themeId}x${i}`;
            }
        }
    })();
    if (!styleId) {
        throw new Error("Could not create new theme variant");
    }
    const realpathToVariant = `${realpathToPackage}/src/styles/${styleId}`;
    (0, fs_extra_1.copySync)(srcStyle, realpathToVariant, { overwrite: true });
    // replace all files by token
    helpers_1.workspace.replaceSourceInDir(realpathToVariant, {
        packageName,
        themeId,
        styleId
    });
    // update develop
    helpers_1.workspace.updateEnv({
        'MFOX_SITE_THEME': `"${themeId}:${styleId}"`
    });
    helpers_1.workspace.enablePackage(packageName);
    helpers_1.workspace.reload();
    console.log(`Created new theme variant .${chalk_1.default.green(realpathToVariant.substring(process.cwd().length))}`);
}
exports.default = main;
