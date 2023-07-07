"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
class PackageInfo {
    constructor(packageName) {
        this.packageName = packageName;
    }
    get realpathToJsonFile() {
        return require.resolve(this.packageName + '/package.json', { paths: [process.cwd()] });
    }
    get realpathToPackage() {
        return path_1.default.dirname(this.realpathToJsonFile);
    }
    get packageJson() {
        return require(this.realpathToJsonFile);
    }
}
exports.default = PackageInfo;
