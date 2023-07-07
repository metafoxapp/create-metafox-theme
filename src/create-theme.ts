import {prompt} from "enquirer";
import {mkdirSync} from 'fs';
import {copySync} from "fs-extra";
import path from "path";
import {workspace} from "./helpers";
import chalk from "chalk";

export default async function main() {
  const persist = workspace.persist();

  const input = await prompt<{
    themeId: string,
    vendorName: string,
    packageName?: string
  }>([
    {
      type: 'input',
      name: 'vendorName',
      message: 'What is your vendor/company name?',
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
      name: 'themeId',
      message: 'What is theme id?',
      initial: persist.get('themeId', '...'),
      format(value: string): string | Promise<string> {
        return value.toLowerCase();
      },
      validate: (value: string) => {
        return /^\w+$/.test(value) ? true : "Contain alpha numeric characters"
      }
    }
  ]);

  console.log(chalk.green(`Generating theme files`));

  const workingDir = process.cwd();
  const {themeId, vendorName} = input;
  const packageName = `@${vendorName}/theme-${themeId}`;

  input.packageName = packageName;

  const srcTheme = path.dirname(__dirname) + `/templates/base-theme`;
  const srcStyle = path.dirname(__dirname) + `/templates/base-theme-variant`;

  const realpathToTheme = `${workingDir}/packages/${vendorName}/theme-${themeId}`;
  const styleId = `${themeId}x0`;
  const realpathToStyle = `${realpathToTheme}/src/styles/${styleId}`;

  mkdirSync(realpathToTheme, {recursive: true});

  copySync(srcTheme, realpathToTheme, {overwrite: true});
  copySync(srcStyle, realpathToStyle, {overwrite: true});

  // replace all files by token
  workspace.replaceSourceInDir(realpathToTheme, {
    packageName,
    themeId,
    styleId
  });

  // update develop

  workspace.updateEnv({
    'MFOX_SITE_THEME': `"${themeId}:${styleId}"`
  })

  persist.save(input);

  workspace.enablePackage(packageName);
  workspace.bootstrap();
  workspace.reload();

  console.log(chalk.cyanBright(`Generated theme ${themeId} located at .${realpathToTheme.substring(workingDir.length)}`))
  console.log(chalk.bold.cyanBright(`Restart frontend terminal to apply changes.`));
}
