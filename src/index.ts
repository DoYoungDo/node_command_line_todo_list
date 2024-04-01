import * as path from "path";
import * as fs from "fs";
import * as dayjs from "dayjs";
import * as readLine from "readline";
import { Command } from "commander";
import { Configer, Loger, Printer, TODO_Item, TODO_Table } from "./types";

namespace APP{
    export const NAME = "todo";
    export const VRESION = "0.1.0";
    export const DESCRIPTION = "待办项";
}

const loger: Loger = new Loger;
const printer: Printer = new Printer;
const configer: Configer = new Configer(loger, printer);

namespace TODO {
    export enum CommandName {
        TODO = "todo",
        ADD = "add",
        RM = "rm",
        MOD = "mod",
        LIST = "list",
        DONE = "done",
        CLEAR = "clear",
        CONF = "conf"
    }

    export function actionTodo(args: string[], options: any, todo: Command) {
        void (options);

        if (!args.length) {
            const list = todo.commands.find((c: Command) => c.name() === CommandName.LIST);
            list?.parse();
        }
        else {
            const add = todo.commands.find((c: Command) => c.name() === CommandName.ADD);
            add?.parse([CommandName.TODO, CommandName.ADD, ...args]);
        }
    }
    export function actionAdd(args: string[], options: any, add: Command) {
        try {
            const file = path.resolve(__dirname, "../static/todolist-table.json");
            const table = JSON.parse(fs.readFileSync(file).toString());

            const begin = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss SSS");
            const todos = args.map(arg => {
                let item: TODO_Item = {
                    todo: arg,
                    done: options.done,
                    begin,
                }
                options.done ? item.end = begin : void 0;
                return item
            })

            printer.printTable([...table.list.map((item: any) => { return {} }), ...todos]);

            table.list.push(...todos);
            fs.writeFileSync(file, JSON.stringify(table, null, "    "));
        } catch (error) {
            console.trace(error);
        }
    }
    export function actionRemove(args: string[]) {
        const indexSet: Set<number> = new Set;
        for (let arg of args) {
            const res = /(\d+)-(\d+)/.exec(arg);
            if (res) {
                const start = Number.parseInt(res[1]);
                const end = Number.parseInt(res[2]);
                if (start > end) {
                    continue;
                }
                else if (start == end) {
                    indexSet.add(Number.parseInt(arg));
                    continue;
                }
                else{
                    for (let i = start; i <= end; ++i) {
                        indexSet.add(i);
                    }
                }
            }
            else if (/\d+/.test(arg)) {
                indexSet.add(Number.parseInt(arg));
                continue;
            }
        }
        if(!indexSet.size){
            loger.logErr("no valid argument");
            return;
        }
        
        // const indexs: number[] = args.map(arg => Number.parseInt(arg)).filter(num => !isNaN(num));
        try {
            const file = path.resolve(__dirname, "../static/todolist-table.json");
            const table = JSON.parse(fs.readFileSync(file).toString());
            const list = (table.list as any[]).filter((_, index) => !indexSet.has(index));
            table.list = list;
            fs.writeFileSync(file, JSON.stringify(table, null, "    "));
            printer.printTable(table.list);
        } catch (error) {
            console.trace(error);
        }
    }
    export function actionModify(arg0: string, arg1: string, option: any, mo: Command) {
        const index = Number.parseInt(arg0);
        if (isNaN(index)) {
            loger.logErr("index not a number");
            return;
        }

        const todo = arg1;

        try {
            const file = path.resolve(__dirname, "../static/todolist-table.json");
            const table :TODO_Table= JSON.parse(fs.readFileSync(file).toString());
            const item: TODO_Item | undefined = table.list.find((_, i) => i === index);
            if(!item){
                loger.logErr("index out if reange.", "todo list length:", `${table.list.length}`);
                return;
            }

            option.append ? item.todo += todo : item.todo = todo;
            option.done ? item.done = option.done : void 0;

            fs.writeFileSync(file, JSON.stringify(table, null, "    "));

            const todos: any[] = new Array(index).fill({},0,index);
            todos.push(item);
            printer.printTable(todos);

        } catch (error) {
            console.trace(error);
        } 

    }
    export function actionList(args: string[], options: any, list: Command) {
        try {
            const file = path.resolve(__dirname, "../static/todolist-table.json");
            const table = JSON.parse(fs.readFileSync(file).toString());
            printer.printTable(table.list);
        } catch (error) {
            console.trace(error);
        }
    }
    export function actionDone(args: string[]){
        const indexs: number[] = args.map(arg => Number.parseInt(arg)).filter(num => !isNaN(num));
        const date = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss SSS");
        const todos: any[] = [];

        try {
            const file = path.resolve(__dirname, "../static/todolist-table.json");
            const table = JSON.parse(fs.readFileSync(file).toString());
            table.list.forEach((item: any, index: number) => {
                if (indexs.includes(index)) {
                    item.done = true;
                    item.end = date;
                    todos.push(item);
                }
                else {
                    todos.push({});
                }
            });

            fs.writeFileSync(file, JSON.stringify(table, null, "    "));
            printer.printTable(todos);
        } catch (error) {
            console.trace(error);
        }
    }
    export function actionClear() {
        try {
            const readline = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question("sure to clear all todo? y/n", (msg) => {
                if (msg.toLowerCase() === "y") {
                    const file = path.resolve(__dirname, "../static/todolist-table.json");
                    const table = JSON.parse(fs.readFileSync(file).toString());
                    table.list = [];

                    fs.writeFileSync(file, JSON.stringify(table, null, "    "));
                    printer.printTable([]);
                }
                else {
                    loger.logInfo(msg)
                }

                readline.close()
            })

        } catch (error) {
            console.trace(error);
        }  
    }
    export function actionConfig(option: any, conf: Command) {
        const list = conf.commands.find((c: Command) => c.name() === Config.CommandName.LIST);
        list?.parse();
    }
    export namespace Config{
        export enum CommandName {
            LIST = "list",
            SET = "set"
        }
        // @ts-ignore
        export function actionList(option: any) {
            if (option.variables) {
                const varsArr: any[] = [];
                for(let key in configer.vars){
                    varsArr.push({ "var": key, description: configer.vars[key] });
                }
                printer.printTable(varsArr);
            }
            else{
                const configArr: any[] = [];
                for (let key in configer.configs) {
                    configArr.push({ "var": key, value: configer.configs[key] });
                }
                printer.printTable(configArr);
            }
        }
        // @ts-ignore
        export function actionSet(name: string, value: string, option: any, set: Command) {
            if (!configer.vars[name]){
                loger.logErr("unsupport variable name:", name);
                loger.logTip("see: 'todo conf list -v'");
            }

            configer.setConfig(name as any, value);
        }
    }
}

(function main(argc: number, argv: any) {
    const app: Command = new Command;

    app.name(APP.NAME)
        .version(APP.VRESION)
        .description(APP.DESCRIPTION)
        .argument("[todo...]", "添加 待办项")
        .action(TODO.actionTodo)

    app.command(TODO.CommandName.ADD)
        .description("添加 待办项")
        .argument("<todo...>", "待办项")
        .option("-d --done", "完成", false)
        .action(TODO.actionAdd)

    app.command(TODO.CommandName.RM)
        .description("删除 待办项")
        .argument("<index...>", "序号")
        .action(TODO.actionRemove);

    app.command(TODO.CommandName.MOD)
        .description("修改 待办项")
        .argument("<index>", "序号")
        .argument("<todo>", "待办内容")
        .option("-a --append", "追加", false)
        .option("-d --done", "完成", false)
        .action(TODO.actionModify)

    app.command(TODO.CommandName.LIST)
        .description("显示 待办项")
        .action(TODO.actionList);

    app.command(TODO.CommandName.DONE)
        .description("完成 待办项")
        .argument("<index...>", "序号")
        .action(TODO.actionDone)

    app.command(TODO.CommandName.CLEAR)
        .description("清空 待办项")
        .action(TODO.actionClear)

    const configCommand = app.command(TODO.CommandName.CONF)
        .description("配置")
        .action(TODO.actionConfig)

    configCommand.command(TODO.Config.CommandName.LIST)
        .description("配置列表")
        .option("-v --variables", "显示所有支持的变量", false)
        .action(TODO.Config.actionList);

    configCommand.command(TODO.Config.CommandName.SET)
        .description("修改配置")
        .argument("<var>", "变量名称")
        .argument("<value>", "变量值")
        .action(TODO.Config.actionSet);

    app.parse(argv);
})(process.argv.length, process.argv);
