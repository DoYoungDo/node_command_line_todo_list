import * as path from "path";
import * as fs from "fs";
import { TODO_Table } from "./types";
import { createTodoTable, File, getAppData, getFormatDate } from "./utils";
import { BuiltinConfigVariable, Configer } from "./configer";
import { Setting } from "./setting";
import { Loger } from "./loger";

export type TodoDate = string;

export type TodoItem = {
    index: number
    todo: string
    done: boolean
    begin: TodoDate
    end?: TodoDate
    description?: string[]
}

export type TodoList = {
    name: string
    date: TodoDate
    list: TodoItem[]
}


export class Todo{
    private _todoFilePath: string
    private _todoListFile: TodoList;
    constructor(private _configer: Configer = new Configer()) {
        this._todoFilePath = path.join(Setting.TODO_LIST_DIR, Setting.config.table);
        this._todoListFile = new File<TodoList>(this._todoFilePath).create({
            name: Setting.config.table,
            date: getFormatDate(Date.now()),
            list: []
        }).read();
     }

    get list(): TodoItem[] {
        return this._todoListFile.list;
    }

    set list(ls: TodoItem[]) {
        this._todoListFile.list = ls;
        new File<TodoList>(this._todoFilePath).write(this._todoListFile);
    }

    getTable(): TODO_Table/*  | undefined */ {
        const author = this._configer.getConfig(BuiltinConfigVariable.AUTHOR);
        const authorPath = path.join(getAppData(), "Todos", author);
        if (!fs.existsSync(authorPath)) {
            fs.mkdirSync(authorPath, { recursive: true });
        }
        
        const tableName = this._configer.getConfig(BuiltinConfigVariable.TABLE);
        const tableFile = path.join(authorPath, `todo_${tableName}_table.json`);
        if (!fs.existsSync(tableFile)) {
            return createTodoTable(tableName, this._configer.getConfig(BuiltinConfigVariable.AUTHOR));
        }

        return JSON.parse(fs.readFileSync(tableFile).toString()) as TODO_Table;
    }

    setTable(table: TODO_Table): void {
        const todoPath = path.join(getAppData(), "Todos", table.author);
        if (!fs.existsSync(todoPath)) {
            fs.mkdirSync(todoPath, { recursive: true });
        }

        const tableFile = path.join(todoPath, `todo_${table.name}_table.json`);
        fs.writeFileSync(tableFile, JSON.stringify(table, null, "  "));
    }
}