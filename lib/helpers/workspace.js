"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const getFiles_1 = __importDefault(require("./getFiles"));
const persist_1 = __importDefault(require("./persist"));
const package_info_1 = __importDefault(require("./package-info"));
class Workspace {
    updateEnv(replacements) {
        const workingDir = process.cwd();
        const envFile = [
            `${workingDir}/app/.env.development.local`,
            `${workingDir}/app/.env.development`
        ].find((file) => (0, fs_1.existsSync)(file));
        if (!envFile) {
            console.log('Could not find .env.development.');
            return;
        }
        let source = (0, fs_1.readFileSync)(envFile, { encoding: 'utf-8' });
        Object.keys(replacements).forEach((key) => {
            const value = replacements[key];
            const reg = new RegExp(`^${key}=.*`, 'm');
            const replacement = `${key}=${value}`;
            if (reg.test(source)) {
                source = source.replace(reg, replacement);
            }
            else {
                source = source + os_1.default.EOL + replacement;
            }
        });
        (0, fs_1.writeFileSync)(envFile, source, { encoding: 'utf-8' });
    }
    bootstrap() {
        console.log(chalk_1.default.green("Updating workspace ..."));
        (0, node_child_process_1.execSync)("yarn bootstrap");
    }
    reload() {
        console.log(chalk_1.default.green("Reloading workspace ..."));
        (0, node_child_process_1.execSync)("yarn reload");
    }
    enablePackage(packageName) {
        const workingDir = process.cwd();
        const file = `${workingDir}/app/settings.json`;
        if (!(0, fs_1.existsSync)(file)) {
            console.log(`Could not find .${file.substring(workingDir.length)}`);
            return;
        }
        const source = require(file);
        source.packages[packageName] = 'local';
        (0, fs_1.writeFileSync)(file, JSON.stringify(source, null, "  "), { encoding: "utf-8" });
    }
    getPackageInfo(packageName) {
        return new package_info_1.default(packageName);
    }
    replaceSourceInDir(dir, values) {
        const files = this.getFiles(dir);
        files.forEach((file) => {
            if (!(0, fs_1.existsSync)(file))
                return;
            let source = (0, fs_1.readFileSync)(file, { encoding: "utf-8" });
            Object.keys(values).forEach((key) => {
                const token = `__${key}__`;
                while (source.search(token) > -1) {
                    source = source.replace(token, values[key]);
                }
            });
            (0, fs_1.writeFileSync)(file, source, { encoding: "utf-8" });
        });
    }
    getFiles(dir) {
        return (0, getFiles_1.default)(dir, []);
    }
    persist() {
        return new persist_1.default(process.cwd() + '/.toolkitrc.json');
    }
}
const workspace = new Workspace();
exports.default = workspace;
