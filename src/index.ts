#!/usr/bin/env node

import { Configer } from "./configer";
import { Loger } from "./loger";
import { AddCommand, ClearCommand, CommandManager, ConfigCommand, DetailCommand, DoneCommand, FindCommand, ListCommand, ModifyCommand, MoveCommand, RemoveCommand, RiseCommand } from "./command_manager";

const loger: Loger = new Loger;
const configer: Configer = new Configer(loger);

function initCommand(): CommandManager {
    const CMD_MNGR = new CommandManager(process.argv);
    CMD_MNGR.registerCommand(new AddCommand(configer));
    CMD_MNGR.registerCommand(new RemoveCommand(configer, loger));
    CMD_MNGR.registerCommand(new ModifyCommand(configer, loger));
    CMD_MNGR.registerCommand(new ListCommand(configer));
    CMD_MNGR.registerCommand(new DoneCommand(configer));
    // CMD_MNGR.registerCommand(new RiseCommand(configer, loger));
    CMD_MNGR.registerCommand(new MoveCommand(configer, loger));
    CMD_MNGR.registerCommand(new FindCommand(configer));
    CMD_MNGR.registerCommand(new ClearCommand(configer, loger));
    CMD_MNGR.registerCommand(new DetailCommand());
    CMD_MNGR.registerCommand(new ConfigCommand(configer, loger));
    return CMD_MNGR;
}

(function main() {
    initCommand().run();
})();