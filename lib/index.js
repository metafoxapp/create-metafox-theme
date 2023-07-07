"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const helpers_1 = require("./helpers");
(async () => {
    if (!(0, fs_1.existsSync)(".workboxrc")) {
        console.log(chalk_1.default.bold.red("Error: Navigate to frontend workspace root then try again!"));
        return;
    }
    const persist = helpers_1.workspace.persist();
    const choices = [
        { message: "Create new app", "name": "./create-app" },
        { message: "Create new theme", "name": "./create-theme" },
        { message: "Create new theme variant", "name": "./create-theme-variant" }
    ];
    const previousCommand = persist.get('commandName', choices[0].message);
    const initial = choices.findIndex(option => option.message === previousCommand);
    const input = await (0, enquirer_1.prompt)({
        type: 'select',
        name: 'commandName',
        message: 'What do you need?',
        initial: initial > 0 ? initial : 0,
        choices: choices.map((option) => option.message)
    });
    const selected = choices.findIndex((option) => option.message === input.commandName);
    const option = choices[selected];
    const commander = require(option.name).default;
    await commander()
        .catch(console.error)
        .finally(() => {
        persist.save(input);
    });
    // reset color to ensure no affected others.
    chalk_1.default.reset();
})();
