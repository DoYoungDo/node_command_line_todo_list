import { Printer } from "./printer";
import { Setting } from "./setting";
import { TodoItem } from "./todo";
import { assert, widthOfStr } from "./utils";

export class Displayer{
    constructor(
        private _printer?: Printer
    ){}

    displayTodoList(todolist: TodoItem[]): any[] {
        if (!todolist.length) {
            return []
        }
        const needPlaceholder = todolist[0].index !== 0;
        let maxLength = 0;
        const result = todolist
            .map(todo => {
                maxLength = Math.max(maxLength, widthOfStr(todo.todo));
                return todo;
            })
            .map(todo => {
                return this.createDisplayTodoItem(
                    todo.index,
                    this.completionTodo(todo.todo, maxLength),
                    todo.done ? "✅" : "❌",
                    // todo.done ? "✅" : "❎",
                    // todo.done ? "√" : "×",
                    todo.begin,
                    todo.end ?? "-",
                    todo.priority ? "⭐".repeat(todo.priority) : ""
                )
        })
        return needPlaceholder ? [this.createDisplayTodoItem("...", "...", "...", "...", "...", ""), ...result] : result
    }

   
    private createDisplayTodoItem(index: any, todo: any, done: any, begin: any, end: any, priority: string): any {
        let obj: any = {
            "状态": done,
            "索引": index,
            "优先级": priority,
            "待办": todo,
            "创建时间": begin,
            "完成时间": end
        }
        // 过滤字段
        let ignore_fields: string = Setting.config["ignore_fields"];
        if(ignore_fields){
            let fields = ignore_fields.split(";");
            fields.forEach((field: string) => {
                if(obj[field]){
                    delete obj[field];
                }
            })
        }

        return obj;
    }

    private completionTodo(todo: string, max: number): string {
        assert(todo.length <= max);

        let len = 0;
        return ((len = max - widthOfStr(todo)) > 0) ? `${todo}${" ".repeat(len)}` : todo;
    }
}