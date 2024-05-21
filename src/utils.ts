import * as dayjs from "dayjs";
import * as os from "os";
import * as path from "path";
import { Loger, TODO_Table } from "./types";

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
export function checkNumber(num: string, loger?: Loger): boolean {
    if (!/^(\d+)$/.test(num)) {
        if (loger) {
            loger.logErr("not a number:", num);
        }
        return false;
    }
    return true
}