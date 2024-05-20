import { Command } from "commander";
import { Configer, Displayer, Printer } from "./types";
import { Todo } from "./todo";

enum BuiltInCommand {
    ADD = "add",
    RM = "rm",
    MOD = "mod",
    LIST = "list",
    DONE = "done",
    CLEAR = "clear",
    RISE = "rise",
    FIND = "find",
    CONF = "conf"
}

abstract class BuiltinCommandBase extends Command{
    abstract actionImp(...args: any[]): void;
}

export class AppCommand extends BuiltinCommandBase{
    private readonly NAME = "todo";
    private readonly VERSION = "0.1.0";
    private readonly DESCRIPTION = "待办项";

    constructor() {
        super();
        this.name(this.NAME)
        .version(this.VERSION)
        .description(this.DESCRIPTION)
        .action(this.actionImp)
    }

    actionImp(args: string[], options: any, todo: Command) {
        void (options);

        if (!args.length) {
            const list = todo.commands.find((c: Command) => c.name() === BuiltInCommand.LIST);
            list?.parse();
        }
        else {
            const add = todo.commands.find((c: Command) => c.name() === BuiltInCommand.ADD);
            add?.parse([this.NAME, BuiltInCommand.ADD, ...args]);
        }
    }
}

export class AddCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.ADD)
            .description("添加 待办项")
            .argument("<todo...>", "待办项")
            .option("-d --done", "添加时完成", false)
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class RemoveCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.RM)
        .description("删除 待办项")
        .argument("<index...>", "索引序号")
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class ModifyCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.MOD)
            .description("修改 待办项")
            .argument("<index>", "索引序号")
            .argument("[todo]", "待办内容")
            .option("-a --append", "在原内容上追加，指定参数todo后生效", false)
            .option("-d --done [done[true|false]]", "修改为完成")
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class ListCommand extends BuiltinCommandBase {
    constructor(private _configer: Configer, private _printer: Printer, private _displayer: Displayer) {
        super();
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

    actionImp(arg: string, options: any, list: Command): void {
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
    constructor() {
        super();
        this.name(BuiltInCommand.DONE)
            .description("完成 待办项")
            .argument("<index...>", "索引序号")
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class ClearCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.CLEAR)
            .description("清空 待办项")
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class RiseCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.RISE)
            .description("提升 待办项")
            .argument("<count>", "提升数量")
            .argument("<index...>", "索引序号")
            .option("-d --down", "反射提升")
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class FindCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.FIND)
            .description("查找 待办项")
            .argument("<todo...>", "查找内容")
            .option("-c --caseSensitive", "区分大小写", false)
            .option("-s --single", "匹配单个条件", false)
            .action(this.actionImp);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}

export class ConfigCommand extends BuiltinCommandBase {
    constructor() {
        super();
        this.name(BuiltInCommand.CONF)
            .description("配置")
            .action(this.actionImp);

        this.addCommand(new ConfigCommand.ListCommand);
        this.addCommand(new ConfigCommand.SetCommand);
    }

    actionImp(args: string[], options: any, add: Command): void {
    }
}
export namespace ConfigCommand{
    enum Names {
        LIST = "list",
        SET = "set"
    }

     export class ListCommand extends BuiltinCommandBase{
        constructor() {
            super();
            this.name(Names.LIST)
                .description("配置列表")
                .argument("[variable]", "变量名称")
                .option("-v --variables", "显示所有支持的变量", false)
                .action(this.actionImp);
        } 

        actionImp(...args: any[]): void {
            throw new Error("Method not implemented.");
        }

    }
    export class SetCommand extends BuiltinCommandBase {
        constructor() {
            super();
            this.name(Names.SET)
                .description("修改配置")
                .argument("<var>", "变量名称")
                .argument("<value>", "变量值") 
                .action(this.actionImp);
        } 

        actionImp(...args: any[]): void {
            throw new Error("Method not implemented.");
        }
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