import {prompt} from "enquirer";
import chalk from "chalk";
import {existsSync} from "fs";
import {workspace} from "./helpers";

(async () => {
  if (!existsSync(".workboxrc")) {
    console.log(chalk.bold.red("Error: Navigate to frontend workspace root then try again!"))
    return;
  }

  const persist = workspace.persist();

  const choices = [
    {message: "Create new app", "name": "./create-app"},
    {message: "Create new theme", "name": "./create-theme"},
    {message: "Create new theme variant", "name": "./create-theme-variant"}
  ];

  const previousCommand = persist.get('commandName', choices[0].message);
  const initial = choices.findIndex(option => option.message === previousCommand)

  const input = await prompt<{ commandName: string }>(
    {
      type: 'select',
      name: 'commandName',
      message: 'What do you need?',
      initial: initial > 0 ? initial : 0,
      choices: choices.map((option) => option.message)
    }
  );

  const selected = choices.findIndex((option) => option.message === input.commandName);

  const option = choices[selected];

  const commander = require(option.name).default;

  await commander()
    .catch(console.error)
    .finally(() => {
      persist.save(input)
    });

  // reset color to ensure no affected others.
  chalk.reset();
})();
