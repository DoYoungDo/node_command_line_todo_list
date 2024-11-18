import * as dayjs from "dayjs";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
// import { TODO_Table } from "./types";
import { Loger } from "./loger";
import { BuiltinConfigVariable } from "./configer";

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
// export function createTodoTable(name: string, author: string): TODO_Table {
//     return {
//         name,
//         author,
//         date: getFormatDate(Date.now()),
//         list: []
//     }
// }
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
export function isBuiltinVariable(mayVar: string): boolean {
    return !!Object.values(BuiltinConfigVariable).find(key => key === mayVar);
}
export function assert(result: boolean, message?: string) {
    if(!result){
        throw new Error(message ?? "Debug Failure.");
    }
}
export function widthOfStr(str: string): number {
    let len = 0;
    for (let i = 0; i < str.length; ++i) {
        if (str.charCodeAt(i) > 255) {
            len += 2;
        }
        else {
            len++;
        }
    }
    return len;
}

export class File<S extends object = {}> {
    constructor(private _filePath: string) {}
    create(data: S): this {
        if (!fs.existsSync(this._filePath)) {
            const dir = path.dirname(this._filePath);
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true })
            }
            this.write(data);
            // fs.writeFileSync(this._filePath, JSON.stringify(data, null, "    "));
        }
        return this;
    }

    get valid():boolean{
        return fs.existsSync(this._filePath);
    }

    read():S{
        // TODO 做缓存
        try {
            return JSON.parse(fs.readFileSync(this._filePath).toString()) as S;
        } catch (error) {
            return {} as S;
        }
    }

    write(data:S){
        fs.writeFileSync(this._filePath, JSON.stringify(data, null, "    "));
    }
}
