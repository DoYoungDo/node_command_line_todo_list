export * from "./loger";
export * from "./printer";
export * from "./configer";
export * from "./displayer";

export type TODO_Date = string;

export type TODO_Item = {
    index: number
    todo: string
    done: boolean
    begin: TODO_Date
    end?: TODO_Date
}

export type TODO_Table = {
    name: string
    date: TODO_Date
    author: string
    list: TODO_Item[]
}

