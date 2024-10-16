import { Command } from "commander";
import { TODO_Item, TODO_Table } from "./types";
import { Todo } from "./todo";
import { checkNumber, getFormatDate, isBuiltinVariable } from "./utils";
import * as readLine from "readline";
import { Printer } from "./printer";
import { Displayer } from "./displayer";
import { BuiltinConfigVariable, BuiltinConfigVariableDescription, Configer } from "./configer";
import { Loger } from "./loger";

enum BuiltInCommand {
    ADD = "add",
    RM = "rm",
    MOD = "mod",
    LIST = "list",
    DONE = "done",
    CLEAR = "clear",
    RISE = "rise",
    MOVE = "mv",
    FIND = "find",
    CONF = "conf",
    DET = "det"
}

abstract class BuiltinCommandBase extends Command{
    constructor(){
        super();
        this.action(this.actionImp);
    }
    abstract actionImp(...args: any[]): void;
}

export class AppCommand extends BuiltinCommandBase{
    private readonly NAME = "todo";
    private readonly VERSION = "1.0.1";
    private readonly DESCRIPTION = "待办项";

    constructor() {
        super();
        this.name(this.NAME)
        .version(this.VERSION)
        .description(this.DESCRIPTION)
        .argument("[todo...]", "添加 待办项")
        .action(this.actionImp)
    }

    actionImp(args: string[], options: any) {
        void (options);

        if (!args.length) {
            const list = this.commands.find((c: Command) => c.name() === BuiltInCommand.LIST);
            list?.parse();
        }
        else {
            const add = this.commands.find((c: Command) => c.name() === BuiltInCommand.ADD);
            add?.parse([this.NAME, BuiltInCommand.ADD, ...args]);
        }
    }
}

export class AddCommand extends BuiltinCommandBase {
    private _printer: Printer
    private _displayer: Displayer
    constructor(private _configer: Configer) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.ADD)
            .description("待办项 详情")
            .argument("<todo>", "待办项")
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any): void {
        try {
            const todoModle = new Todo(this._configer)
            const table = todoModle.getTable();

            const begin = getFormatDate(Date.now());
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

            this._printer.printTable(this._displayer.displayTodoList(todos));

            table.list.push(...todos);

            todoModle.setTable(table);
        } catch (error) {
            console.trace(error);
        }
    }
}

export class RemoveCommand extends BuiltinCommandBase {
    private _printer: Printer
    private _displayer: Displayer
    constructor(private _configer: Configer,  private _loger: Loger) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.RM)
        .description("删除 待办项")
        .argument("<index...>", "索引序号")
            .action(this.actionImp);
    }

    actionImp(args: string[]): void {
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
                else {
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
        if (!indexSet.size) {
            this._loger.logErr("no valid argument");
            return;
        }

        // const indexs: number[] = args.map(arg => Number.parseInt(arg)).filter(num => !isNaN(num));
        try {
            const todoModle = new Todo(this._configer)
            const table = todoModle.getTable();
            const list = (table.list as any[]).filter((item) => !indexSet.has(item.index)).map((item, index) => { item.index = index; return item });
            table.list = list;
            this._printer.printTable(this._displayer.displayTodoList(table.list));

            todoModle.setTable(table);
        } catch (error) {
            console.trace(error);
        }
    }
}

export class ModifyCommand extends BuiltinCommandBase {
    private _printer: Printer
    private _displayer: Displayer
    constructor(private _configer: Configer, private _loger: Loger) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.MOD)
            .description("修改 待办项")
            .argument("<index>", "索引序号")
            .argument("[todo]", "待办内容")
            .option("-a --append", "在原内容上追加，指定参数todo后生效", false)
            .option("-i --insert", "在原内容上头插，指定参数todo后生效，优先级低于append", false)
            .option("-d --done [done[true|false]]", "修改为完成")
            .action(this.actionImp);
    }

    actionImp(arg0: string, arg1: string, option: any): void {
        const index = Number.parseInt(arg0);
        if (isNaN(index)) {
            this._loger.logErr("index not a number");
            return;
        }

        const todo = arg1;

        try {
            const todoModle = new Todo(this._configer);
            const table: TODO_Table = todoModle.getTable();
            const item: TODO_Item | undefined = table.list.find((_, i) => i === index);
            if (!item) {
                this._loger.logErr("index out if reange.", "todo list length:", `${table.list.length}`);
                return;
            }

            if(!!todo){
                if (option.append) {
                    item.todo += todo;
                }
                else if(option.insert){
                    item.todo = todo + item.todo;
                }
                else {
                    item.todo = todo;
                }
            }

            if (option.done) {
                const done = this.optionDone(option);
                item.done = done;
                item.end = done ? getFormatDate(Date.now()) : "-"
            }

            this._printer.printTable(this._displayer.displayTodoList([item]));

            todoModle.setTable(table);
        } catch (error) {
            console.trace(error);
        }
    }
    optionDone(options: any): boolean {
        if (options.done) {
            if(/false/.test(options.done)){
                return false;
            }
            return true;
        }
        return false;
    }
}

export class ListCommand extends BuiltinCommandBase {
    private _printer: Printer;
    private _displayer: Displayer;
    constructor(private _configer: Configer, ) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.LIST)
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
            .action(this.actionImp);
    }

    actionImp(arg: string, options: any): void {
        try {
            const todo = new Todo(this._configer);
            const table = todo.getTable();
            if (options.count){
                this._printer.printLine("count:", table.list.length);
                return;
            }

            const [begin, end] = this.getRange(arg);

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

            this._printer.printTable(this._displayer.displayTodoList(list));
        } catch (error) {
            console.trace(error);
        }
    }
    getRange(text:string): [number | undefined/* begin */, number | undefined/* end */] {
        if (!text) {
            return [undefined, undefined];
        }

        const input = text.trim();
        if (/^(\d+)$/.test(input)) {
            return [Number.parseInt(input), undefined];
        }

        let regRes = /^\[?(\d+)-?$/.exec(text.trim());
        if (regRes && regRes.length) {
            return [Number.parseInt(regRes[1]), undefined];
        }

        regRes = /^(\d+)\]$/.exec(text.trim());
        if (regRes && regRes.length) {
            return [undefined, Number.parseInt(regRes[1])];
        }

        regRes = /^\[?(\d+)-(\d+)\]?$/.exec(text.trim());
        if (regRes && regRes.length) {
            return [Number.parseInt(regRes[1]), Number.parseInt(regRes[2])];
        }

        return [undefined, undefined];
    }
}

export class DoneCommand extends BuiltinCommandBase {
    private _printer: Printer;
    private _displayer: Displayer;
    constructor(private _configer: Configer) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.DONE)
            .description("完成 待办项")
            .argument("<index...>", "索引序号")
            .action(this.actionImp);
    }

    actionImp(args: string[]): void {
        const indexs: number[] = args.map(arg => Number.parseInt(arg)).filter(num => !isNaN(num));
        const date = getFormatDate(Date.now());
        const todos: any[] = [];

        try {
            const todoModle = new Todo(this._configer);
            const table = todoModle.getTable();
            table.list.forEach((item: any, index: number) => {
                if (indexs.includes(index)) {
                    item.done = true;
                    item.end = date;
                    todos.push(item);
                }
            });

            this._printer.printTable(this._displayer.displayTodoList(todos));

            todoModle.setTable(table);
        } catch (error) {
            console.trace(error);
        }
    }
}

export class ClearCommand extends BuiltinCommandBase {
    private _printer: Printer;
    private _displayer: Displayer;
    constructor(private _configer: Configer, private _loger: Loger) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);
        
        this.name(BuiltInCommand.CLEAR)
            .description("清空 待办项")
            .action(this.actionImp);
    }

    actionImp(args: string[]): void {
        try {
            const readline = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question("sure to clear all todo? y/n", (msg) => {
                if (msg.toLowerCase() === "y") {
                    const todo = new Todo(this._configer);
                    const table = todo.getTable();
                    table.list = [];

                    this._printer.printTable([]);

                    todo.setTable(table);
                }
                else {
                    this._loger.logInfo(msg)
                }

                readline.close()
            })

        } catch (error) {
            console.trace(error);
        }
    }
}

export class RiseCommand extends BuiltinCommandBase {
    private _printer: Printer;
    private _displayer: Displayer;
    constructor(private _configer: Configer, private _loger: Loger) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.RISE)
            .description("提升 待办项")
            .argument("<count>", "提升数量")
            .argument("<index...>", "索引序号")
            .option("-d --down", "反射提升")
            .action(this.actionImp);
    }

    actionImp(arg0: string, arg1: string[], option: any): void {
        try {
            if (!checkNumber(arg0, this._loger)) {
                return;
            }
            const count = Number.parseInt(arg0);
            if (count <= 0) {
                this._loger.logWarn("invalid count, count must > 0");
                return;
            }

            const indexs = arg1.filter(arg => checkNumber(arg)).map(item => Number.parseInt(item));
            if (!indexs.length) {
                this._loger.logErr("got no valid index");
                return;
            }

            const todoModle = new Todo(this._configer);
            const table = todoModle.getTable();
            let list = table.list;
            for (let index of indexs) {
                if (index < 0) {
                    continue;
                }

                const item = list.find(item => item.index === index)!;
                const listWithoutIndexItem = list.filter(item => item.index !== index);

                const targetIndex = option.down ? (index + count) : ((index - count) < 0 ? 0 : index - count);
                list = listWithoutIndexItem.slice(0, targetIndex).concat([item]).concat(listWithoutIndexItem.slice(targetIndex));
            }

            table.list = list.map((item, index) => { item.index = index; return item; });

            this._printer.printTable(this._displayer.displayTodoList(table.list));

            todoModle.setTable(table);
        } catch (error) {
            console.trace(error);
        }

    }
}

export class MoveCommand extends BuiltinCommandBase{
    constructor(private _configer:Configer, private _loger:Loger){
        super();
        this.name(BuiltInCommand.MOVE)
            .description("移动 待办项")
            .argument("<index>", "待移动的待办项索引序号")
            .argument("<dist index>", "目标索引序号");
    }

    actionImp(arg0: string, arg1: string): void {
        try {
            if (!checkNumber(arg0, this._loger)) {
                return;
            }
            if (!checkNumber(arg1, this._loger)) {
                return;
            }
            const index = Number.parseInt(arg0);
            const distIndex = Number.parseInt(arg1);
            if (index < 0 || distIndex < 0) {
                this._loger.logWarn("invalid index or dist index, index and dost index must > 0");
                return;
            }
        

            const todoModle = new Todo(this._configer);
            const table = todoModle.getTable();
            let list = table.list;

            if(index === distIndex){
                // 打印列表
                new Printer().printTable(new Displayer().displayTodoList(table.list));
                return;
            }

            let beforeIndexArr = list.slice(0, index);
            let indexItem = list[index];
            let afterIndexArr = list.slice(index + 1);

            // 向前移动
            if(index > distIndex){
                list = beforeIndexArr.slice(0,distIndex).concat(indexItem).concat(beforeIndexArr.slice(distIndex)).concat(afterIndexArr);
            }
            // 身后移动
            else{
                list = beforeIndexArr.concat(afterIndexArr.slice(0, distIndex - index)).concat(indexItem).concat(afterIndexArr.slice(distIndex - index));
            }

            // 重新构建索引
            table.list = list.map((item, index) => { item.index = index; return item; });

            // 更新列表
            todoModle.setTable(table); 

            // 打印列表
            new Printer().printTable(new Displayer().displayTodoList(table.list));
        } catch (error) {
            console.trace(error);
        }
    }
}

export class FindCommand extends BuiltinCommandBase {
    private _printer: Printer;
    private _displayer: Displayer;
    constructor(private _configer: Configer) {
        super();
        this._printer = new Printer;
        this._displayer = new Displayer(this._printer);

        this.name(BuiltInCommand.FIND)
            .description("查找 待办项")
            .argument("<todo...>", "查找内容")
            .option("-c --caseSensitive", "区分大小写", false)
            .option("-s --single", "匹配单个条件", false)
            .option("-d --done [true|false]", "匹配完成待办")
            .action(this.actionImp);
    }

    actionImp(arg0: string[], option: any): void {
        const todoModle = new Todo(this._configer);
        const filters = option.caseSensitive ? arg0 : arg0.map(arg => arg.toLowerCase());
        const done = option.done === undefined ? undefined : (/false/.test(option.done) ? false : true);

        const table = todoModle.getTable();

        let list = table.list.filter(done === undefined ? item => item : item => item.done === done)
            .filter(item => {
                let todo = option.caseSensitive ? item.todo : item.todo.toLowerCase();
                if (option.single) {
                    return !!filters.find(filter => (todo).includes(filter));
                }
                else {
                    return !filters.find(filter => !(todo).includes(filter));
                }
            })

        if (!list.length) {
            this._printer.printLine(`can not find todo about contain: ${arg0}`)
            return;
        }

        this._printer.printTable(this._displayer.displayTodoList(list));
    }
}

export class ConfigCommand extends BuiltinCommandBase {
    constructor(private _configer: Configer, private _loger: Loger) {
        super();
        this.name(BuiltInCommand.CONF)
            .description("配置")
            .action(this.actionImp);

        this.addCommand(new ConfigCommand.ListCommand(this._configer));
        this.addCommand(new ConfigCommand.SetCommand(this._configer, this._loger));
    }

    actionImp(option: any): void {
        const list = this.commands.find((c: Command) => c.name() === ConfigCommand.Names.LIST);
        list?.parse();
    }
}
export namespace ConfigCommand{
    export enum Names {
        LIST = "list",
        SET = "set"
    }

    export class ListCommand extends BuiltinCommandBase {
        private _printer: Printer;
        private _displayer: Displayer;
        constructor(private _configer: Configer) {
            super();
            this._printer = new Printer;
            this._displayer = new Displayer(this._printer);
            this.name(Names.LIST)
                .description("配置列表")
                .argument("[variable]", "变量名称")
                .option("-v --variables", "显示所有支持的变量", false)
                .action(this.actionImp);
        }

        actionImp(arg: string, option: any): void {
            // console.log(this.args);
            if (arg && !!isBuiltinVariable(arg)) {
                const history = this._configer.getHistory(arg as BuiltinConfigVariable);
                this._printer.printTable(history);
                return;
            }
            
            if (option.variables) {
                const varsArr: any[] = [];
                for (let key of Object.values(BuiltinConfigVariable)) {
                    varsArr.push({ "var": key, description: BuiltinConfigVariableDescription[key as BuiltinConfigVariable] });
                }
                this._printer.printTable(varsArr);
            }
            else{
                const configArr: any[] = [];
                for (let key in this._configer.configs) {
                    configArr.push({ "var": key, value: this._configer.configs[key as BuiltinConfigVariable] });
                }
                this._printer.printTable(configArr);
            }
        }

    }
    export class SetCommand extends BuiltinCommandBase {
        private _printer: Printer;
        private _displayer: Displayer;
        constructor(private _configer: Configer, private _loger: Loger) {
            super();
            this._printer = new Printer;
            this._displayer = new Displayer(this._printer);
            this.name(Names.SET)
                .description("修改配置")
                .argument("<var>", "变量名称")
                .argument("<value>", "变量值")
                .action(this.actionImp);
        }

        actionImp(name: string, value: string, option: any): void {
            if (!isBuiltinVariable(name)) {
                this._loger.logErr("unsupport variable name:", name);
                this._loger.logTip("see: 'todo conf list -v'");
                return;
            }

            this._configer.setConfig(name as any, value);
        }
    }
}

export class DetailCommand extends BuiltinCommandBase{
    constructor(){
        super()
        this.name(BuiltInCommand.DET)
            .description("添加 待办项")
            .argument("<index...>", "待办项")
            .action(this.actionImp);
    }
    actionImp(...args: any[]): void {
        console.log("...")
        // throw new Error("Method not implemented.");
    }

}

export class CommandManager{
    private appCommand:Command;
    
    constructor(private _argv: string[]) {
        this.appCommand = new AppCommand;
    }

    run(){
        this.appCommand.parse(this._argv);
    }

    registerCommand(cmd: Command, parantName?: string) {
        if (parantName) {
            const command = this.getCommandByName(this.appCommand, parantName);
            if (command) {
                command.addCommand(cmd);
            }
        }
        else{
            this.appCommand.addCommand(cmd);
        }
    }

    getCommandByName(command: Command, name: string): Command | undefined {
        return command.commands.find(cmd => cmd.name() === name);
    }

}