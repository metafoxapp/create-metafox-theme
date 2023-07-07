import {prompt} from "enquirer";
import {workspace} from "./helpers";
import chalk from "chalk";
import {copySync} from "fs-extra";
import path from "path";

export default async function main() {
  const persist = workspace.persist();

  const input = await prompt<{ vendorName: string, appName: string, packageName?: string }>([
    {
      type: 'input',
      name: 'vendorName',
      message: 'What is vendor/company name?',
      initial: persist.get('vendorName', '...'),
      format(value: string): string | Promise<string> {
        return value.toLowerCase();
      },
      validate: (value: string) => {
        return /^\w+$/.test(value) ? true : "Contain alpha numeric characters"
      }
    },
    {
      type: 'input',
      name: 'appName',
      message: 'What is app name?',
      initial: persist.get('appName', '...'),
      format(value: string): string | Promise<string> {
        return value.toLowerCase();
      },
      validate: (value: string) => {
        return /^\w+$/.test(value) ? true : "Contain alpha numeric characters"
      }
    }
  ]);

  const {vendorName, appName} = input;

  console.log(chalk.green("Generating files ..."));

  const workingDir = process.cwd();
  const packageName = `@${vendorName}/${appName}`;
  const realpathToApp = `${workingDir}/packages/${vendorName}/${appName}`;

  copySync(`${path.dirname(__dirname)}/templates/base-app`, realpathToApp);

  workspace.replaceSourceInDir(realpathToApp, {
    appName,
    vendorName,
    packageName,
  })

  persist.save(input);
  workspace.bootstrap()
  workspace.reload();

  console.log(chalk.cyanBright(`Generated ${packageName} located at .${realpathToApp.substring(workingDir.length)}`))
  console.log(chalk.bold.cyanBright(`Restart frontend terminal to apply changes.`));
}
