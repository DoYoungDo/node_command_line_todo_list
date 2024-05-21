#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as dayjs from "dayjs";
import { Command } from "commander";
import { Configer, Displayer, Loger, Printer, TODO_Item, TODO_Table, Var } from "./types";
import { AddCommand, ClearCommand, CommandManager, ConfigCommand, DoneCommand, FindCommand, ListCommand, ModifyCommand, RemoveCommand, RiseCommand } from "./command_manager";

const loger: Loger = new Loger;
const configer: Configer = new Configer(loger);

function initCommand(): CommandManager {
    const CMD_MNGR = new CommandManager(process.argv);
    CMD_MNGR.registerCommand(new AddCommand(configer));
    CMD_MNGR.registerCommand(new RemoveCommand(configer, loger));
    CMD_MNGR.registerCommand(new ModifyCommand(configer, loger));
    CMD_MNGR.registerCommand(new ListCommand(configer));
    CMD_MNGR.registerCommand(new DoneCommand(configer));
    CMD_MNGR.registerCommand(new ClearCommand(configer, loger));
    CMD_MNGR.registerCommand(new RiseCommand(configer, loger));
    CMD_MNGR.registerCommand(new FindCommand(configer));
    CMD_MNGR.registerCommand(new ConfigCommand(configer, loger));
    return CMD_MNGR;
}

(function main() {
    initCommand().run();
})();