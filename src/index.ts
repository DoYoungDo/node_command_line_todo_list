import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as dayjs from "dayjs";
import * as readLine from "readline";
import { Command } from "commander";
import { Configer, Displayer, Loger, Printer, TODO_Item, TODO_Table, Var } from "./types";

namespace APP{
    export const NAME = "todo";
    export const VRESION = "0.1.0";
    export const DESCRIPTION = "待办项";
}

const loger: Loger = new Loger;
const printer: Printer = new Printer;
const configer: Configer = new Configer(loger);
const displayer: Displayer = new Displayer(printer);

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
            const table = Internal.getTodoTable();
            
            const begin = Internal.getFormatDate(Date.now());
            const todos = args.map((arg, index) => {
                let item: TODO_Item = {
                    index: table.list.length - 1 + index + 1,
                    todo: arg,
                    done: options.done,
                    begin,
                }
                options.done ? item.end = begin : void 0;
                return item
            })

            printer.printTable(displayer.displayTodoList(todos));
            
            table.list.push(...todos);

            Internal.updateTodoTableToLocal(table);
        } catch (error) {
            console.trace(error);
        }
    }
    export function actionRemove(args: string[]) {
        const indexSet: Set<number> = new Set;
        for (let arg of args) {
            const res = /^(\d+)-(\d+)$/.exec(arg);
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
            else if (/^\d+$/.test(arg)) {
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
            const table = Internal.getTodoTable();
            const list = (table.list as any[]).filter((item) => !indexSet.has(item.index)).map((item, index) => { item.index = index; return item });
            table.list = list;
            printer.printTable(displayer.displayTodoList(table.list));

            Internal.updateTodoTableToLocal(table);
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
            const table: TODO_Table = Internal.getTodoTable();
            const item: TODO_Item | undefined = table.list.find((_, i) => i === index);
            if(!item){
                loger.logErr("index out if reange.", "todo list length:", `${table.list.length}`);
                return;
            }

            option.append ? item.todo += todo : item.todo = todo;
            option.done ? item.done = option.done : void 0;

            const todos: any[] = new Array(index).fill({},0,index);
            todos.push(item);
            printer.printTable(displayer.displayTodoList(todos));

            Internal.updateTodoTableToLocal(table);
        } catch (error) {
            console.trace(error);
        } 

    }
    export function actionList(arg: string, options: any, list: Command) {
        try {
            const table = Internal.getTodoTable();
            if (options.count){
                printer.printLine("count:", table.list.length);
                return;
            }

            const [begin, end] = getRange();

            const list = table.list.filter((item, index) => {
                if (begin && index < begin) {
                    return false;
                }

                if(end && index > end){
                    return false
                }

                if (options.done) {
                    if (/true/.test(options.done)) {
                        return item.done
                    }
                    else if(/false/.test(options.done)){
                        return !item.done
                    }
                }

                return true;
            })

            printer.printTable(displayer.displayTodoList(list));
        } catch (error) {
            console.trace(error);
        }

        function getRange(): [number | undefined/* begin */, number | undefined/* end */] {
            if(!arg){
                return [undefined, undefined];
            }

            const input = arg.trim();
            if (/^(\d+)$/.test(input)) {
                return [Number.parseInt(input), undefined];
            }
        
            let regRes = /^\[?(\d+)-?$/.exec(arg.trim());
            if(regRes && regRes.length){
                return [Number.parseInt(regRes[1]), undefined];
            }
            
            regRes = /^(\d+)\]$/.exec(arg.trim());
            if(regRes && regRes.length){
                return [undefined, Number.parseInt(regRes[1])];
            }

            regRes = /^\[?(\d+)-(\d+)\]?$/.exec(arg.trim());
            if(regRes && regRes.length){
                return [Number.parseInt(regRes[1]), Number.parseInt(regRes[2])];
            }

            return [undefined, undefined];
        }
    }
    export function actionDone(args: string[]){
        const indexs: number[] = args.map(arg => Number.parseInt(arg)).filter(num => !isNaN(num));
        const date = Internal.getFormatDate(Date.now());
        const todos: any[] = [];

        try {
            const table = Internal.getTodoTable();
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

            printer.printTable(displayer.displayTodoList(todos));
        
            Internal.updateTodoTableToLocal(table);
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
                    const table = Internal.getTodoTable();
                    table.list = [];

                    printer.printTable([]);

                    Internal.updateTodoTableToLocal(table);
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
                    varsArr.push({ "var": key, description: configer.vars[key as Var] });
                }
                printer.printTable(varsArr);
            }
            else{
                const configArr: any[] = [];
                for (let key in configer.configs) {
                    configArr.push({ "var": key, value: configer.configs[key as Var] });
                }
                printer.printTable(configArr);
            }
        }
        // @ts-ignore
        export function actionSet(name: string, value: string, option: any, set: Command) {
            if (!configer.vars[name as Var]) {
                loger.logErr("unsupport variable name:", name);
                loger.logTip("see: 'todo conf list -v'");
                return;
            }

            configer.setConfig(name as any, value);
        }
    }

    namespace Internal {
        export function getTodoTable(): TODO_Table {
            const author = configer.getConfig(Var.AUTHOR);
            const authorPath = path.join(getAppData(), "Todos", author);
            if (!fs.existsSync(authorPath)) {
                fs.mkdirSync(authorPath, { recursive: true });
            }
            
            const tableName = configer.getConfig(Var.TABLE);
            const tableFile = path.join(authorPath, `todo_${tableName}_table.json`);
            if (!fs.existsSync(tableFile)) {
                return createTodoTable(tableName, configer.getConfig(Var.AUTHOR));
            }

            return JSON.parse(fs.readFileSync(tableFile).toString()) as TODO_Table;
        }
        export function updateTodoTableToLocal(table: TODO_Table) {
            const todoPath = path.join(getAppData(), "Todos", table.author);
            if (!fs.existsSync(todoPath)) {
                fs.mkdirSync(todoPath, { recursive: true });
            }

            const tableFile = path.join(todoPath, `todo_${table.name}_table.json`);
            fs.writeFileSync(tableFile, JSON.stringify(table, null, "  "));
        }

        export function getAppData(): string {
            switch(os.platform()){
                case "darwin":
                    return path.join(os.homedir(), "/Library/Application Support");
                case "win32":
                    return path.join(os.homedir(), "/AppData/Roaming");
                default:
                    return os.homedir();
            }
        }
        export function createTodoTable(name: string, author: string): TODO_Table {
            return {
                name,
                author,
                date: getFormatDate(Date.now()),
                list: []
            }
        }
        export function getFormatDate(date: number): string {
            return dayjs(date).format("YYYY-MM-DD HH:mm:ss SSS")
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
        .option("-d --done", "添加时完成", false)
        .action(TODO.actionAdd)

    app.command(TODO.CommandName.RM)
        .description("删除 待办项")
        .argument("<index...>", "索引序号")
        .action(TODO.actionRemove);

    app.command(TODO.CommandName.MOD)
        .description("修改 待办项")
        .argument("<index>", "索引序号")
        .argument("<todo>", "待办内容")
        .option("-a --append", "在原内容上追加", false)
        .option("-d --done", "修改为完成", false)
        .action(TODO.actionModify)

    app.command(TODO.CommandName.LIST)
        .description("显示 待办项")
        .argument("[range]", ["显示范围",
            "起始：[start | [start-，结束缺省:max",
            "结束：end]，起始缺省：0",
            "起始-结束：[start-end] | start-end",
            "例：",
            "查看起始位置为12的：[12 或 [12- ",
            "查看起始位置为12结束位置为14的：12-14 或 [12-14]",
            "查看起始位置为0结束位置为14的：14],14] = [0-14] = 0-14"].join("\n"))
        .option("-d --done [done[true|false]]", "只显示完成的")
        .option("-c --count", "显示数量", false)
        .action(TODO.actionList);

    app.command(TODO.CommandName.DONE)
        .description("完成 待办项")
        .argument("<index...>", "索引序号")
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
