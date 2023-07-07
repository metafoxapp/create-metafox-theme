import {prompt} from "enquirer";
import {copySync} from "fs-extra";
import path from "path";
import {workspace} from "./helpers";
import {existsSync} from "fs";
import chalk from "chalk";

export default async function main() {
  const persist = workspace.persist();

  const input = await prompt<{
    packageName: string
  }>([
    {
      type: 'input',
      name: 'packageName',
      message: 'Add to package name',
      initial: persist.get('packageName', '...'),
      format(value: string): string | Promise<string> {
        return value.toLowerCase();
      }
    }
  ]);

  persist.save(input);

  const {packageName} = input;

  const {packageJson, realpathToPackage} = workspace.getPackageInfo(packageName);

  const srcStyle = path.dirname(__dirname) + `/templates/base-theme-variant`;
  const themeId = packageJson?.metafox?.theme;

  if (!themeId) {
    // there are no theme id?
    throw new Error("package may not a theme?");
  }

  const styleId = (() => {
    for (let i = 0; i < 100; ++i) {
      if (!existsSync(`${realpathToPackage}/src/styles/${themeId}x${i}`)) {
        return `${themeId}x${i}`;
      }
    }
  })();

  if (!styleId) {
    throw new Error("Could not create new theme variant");
  }


  const realpathToVariant = `${realpathToPackage}/src/styles/${styleId}`;

  copySync(srcStyle, realpathToVariant, {overwrite: true});

  // replace all files by token
  workspace.replaceSourceInDir(realpathToVariant, {
    packageName,
    themeId,
    styleId
  });

  // update develop
  workspace.updateEnv({
    'MFOX_SITE_THEME': `"${themeId}:${styleId}"`
  });

  workspace.enablePackage(packageName)
  workspace.reload();

  console.log(chalk.cyanBright(`Created new theme variant .${chalk.green(realpathToVariant.substring(process.cwd().length))}`))
  console.log(chalk.bold.cyanBright(`Restart frontend terminal to apply changes.`));
}
