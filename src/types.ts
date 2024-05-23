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

export type Config_History = {
    [key: string]: string[]
}

export type Config_Current = {
    [key: string]: string
}