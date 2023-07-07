import {execSync} from "node:child_process";
import chalk from "chalk";
import {existsSync, readFileSync, writeFileSync} from "fs";
import os from "os";
import getFiles from "./getFiles";
import Persist from "./persist";
import PackageInfo from './package-info'

class Workspace {
  updateEnv(replacements: Record<string, unknown>) {
    const workingDir = process.cwd();

    const envFile = [
      `${workingDir}/app/.env.development.local`,
      `${workingDir}/app/.env.development`
    ].find((file) => existsSync(file))

    if (!envFile) {
      console.log('Could not find .env.development.');
      return;
    }

    let source = readFileSync(envFile, {encoding: 'utf-8'});
    Object.keys(replacements).forEach((key) => {
      const value = replacements[key]
      const reg = new RegExp(`^${key}=.*`, 'm');
      const replacement = `${key}=${value}`
      if (reg.test(source)) {
        source = source.replace(reg, replacement);
      } else {
        source = source + os.EOL + replacement;
      }
    })


    writeFileSync(envFile, source, {encoding: 'utf-8'})
  }

  bootstrap() {
    console.log(chalk.green("Updating workspace ..."));
    execSync("yarn bootstrap");
  }

  reload() {
    console.log(chalk.green("Reloading workspace ..."));
    execSync("yarn reload");
  }

  enablePackage(packageName: string) {
    const workingDir = process.cwd();

    const file = `${workingDir}/app/settings.json`;

    if (!existsSync(file)) {
      console.log(`Could not find .${file.substring(workingDir.length)}`)
      return
    }

    const source: { packages: Record<string, string> } = require(file);

    source.packages[packageName] = 'local';

    writeFileSync(file, JSON.stringify(source, null, "  "), {encoding: "utf-8"})
  }

  getPackageInfo(packageName: string) {
    return new PackageInfo(packageName);
  }

  replaceSourceInDir(dir: string, values: Record<string, string>) {

    const files = this.getFiles(dir);

    files.forEach((file) => {
      if (!existsSync(file)) return;
      let source = readFileSync(file, {encoding: "utf-8"});

      Object.keys(values).forEach((key) => {
        const token = `__${key}__`;
        while (source.search(token) > -1) {
          source = source.replace(token, values[key]);
        }
      })
      writeFileSync(file, source, {encoding: "utf-8"})
    })
  }

  getFiles(dir: string): string[] {
    return getFiles(dir, []);
  }

  persist() {
    return new Persist(process.cwd() + '/.toolkitrc.json')
  }
}

const workspace = new Workspace();

export default workspace;
