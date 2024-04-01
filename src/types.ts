export * from "./loger";
export * from "./printer";
export * from "./configer";

export type TODO_Date = string;

export type TODO_Item = {
    todo: string,
    done: boolean,
    begin: TODO_Date
    end?: TODO_Date
}

export type TODO_Table = {
    name: string,
    date: TODO_Date,
    author: string,
    list: TODO_Item[]
}

export type TODO_Display={
    todo:string,
    done: "×" | "√",
    create: TODO_Date,
    finished?: TODO_Date
}