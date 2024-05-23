import * as path from "path";
import * as fs from "fs";
import { TODO_Table } from "./types";
import { createTodoTable, getAppData } from "./utils";
import { BuiltinConfigVariable, Configer } from "./configer";

export class Todo{
    constructor(private _configer:Configer) {
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