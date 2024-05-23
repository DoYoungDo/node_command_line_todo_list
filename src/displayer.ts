import { Printer } from "./printer";
import { TODO_Item } from "./types";

export class Displayer{
    constructor(
        private _printer:Printer
    ){}

    displayTodoList(todolist: TODO_Item[]): any[] {
        if (!todolist.length) {
            return []
        }
        const needPlaceholder = todolist[0].index !== 0;
        const result = todolist.map(todo => {
            return this.createDisplayTodoItem(
                todo.index,
                todo.todo,
                todo.done ? "✅" : "❌",
                // todo.done ? "✅" : "❎",
                // todo.done ? "√" : "×",
                todo.begin,
                todo.end ?? "-"
            )
        })

        return needPlaceholder ? [this.createDisplayTodoItem("...", "...", "...", "...", "..."), ...result] : result
    }

   
    private createDisplayTodoItem(index: any, todo: any, done: any, begin: any, end: any): any {
        return {
            "状态": done,
            "索引": index,
            "待办": todo,
            "创建时间": begin,
            "完成时间": end
        }
    }
}