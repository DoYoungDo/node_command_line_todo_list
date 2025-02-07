import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { File } from "./utils";
import { Printer } from "./printer";

export type Config = {
    [key: string]: any
    table: string,
    tables: string[]
}
export type History = {
    [key: string]: string[]
}

export class Setting {
    static readonly TOTO_HOME_DIR = path.join(os.homedir(), ".todo");
    static readonly TODO_LIST_DIR = path.join(this.TOTO_HOME_DIR, "todos");
    static readonly TODO_SETTING_FILE_PATH = path.join(this.TOTO_HOME_DIR, "setting");
    static readonly TODO_HISTORY_FILE_PATH = path.join(this.TOTO_HOME_DIR, "history");

    static get config() :Config{
        const conf = new File<Config>(this.TODO_SETTING_FILE_PATH).create({
            table: "default",
            tables: ["default"]
        }).read();
        
        const valueChecker: Map<string, (target: any, p: string | symbol, newValue: any) => boolean> = new Map()
        valueChecker.set("table", (target: any, p: string | symbol, newValue: any): boolean => {
            if (typeof newValue !== "string") {
                new Printer().printLine(`无法为内置属性：${p as string} 设置无效的值：${newValue}`)
                return true
            }

            const cfg = target as Config;
            cfg.tables.includes(newValue) ? void 0 : cfg.tables.push(newValue);
            cfg["table"] = newValue;
        
            Setting.config = cfg;

            return true;
        })

        return new Proxy(conf,{
            set(target: any, p: string | symbol, newValue: any, receiver: any): boolean {

                // 保存历史
                const saveHistory = () => {
                    let history = Setting.history;
                    let array = history[p as any]
                    array.push(target[p])
                    history[p as any] = array;
                    Setting.history = history;
                }

                if (valueChecker.has(p as string)) {
                    if (valueChecker.get(p as string)!(target, p, newValue)) {
                        saveHistory();
                        return true;
                    }
                    else{
                        return false
                    }
                }
                else {
                    saveHistory();

                    // 更新数据
                    let result = target[p] = newValue; 
                    Setting.config = target;
                    return result;
                }
            },
            deleteProperty(target: any, p: string | symbol): boolean {
                if(valueChecker.has(p as string)){
                    return false;
                }
                else{
                    let result = delete target[p];
                    Setting.config = target;
                    return result;
                }
            }
        })
    }

    static set config(cfg: Config) {
        new File<Config>(this.TODO_SETTING_FILE_PATH).write(cfg);
    }

    static get history():History{
        let his = new File<History>(this.TODO_HISTORY_FILE_PATH).create({}).read(); 
        return new Proxy(his, {
            get(target: any, p: string | symbol, receiver: any): any {
                let result = target[p];
                return result ? result : [];
            }
        })
    }

    static set history(his: History) {
        new File<History>(this.TODO_HISTORY_FILE_PATH).write(his);
    }

    static init(){
        if (!fs.existsSync(this.TOTO_HOME_DIR)) {
            fs.mkdirSync(this.TOTO_HOME_DIR);
        }
        if (!fs.existsSync(this.TODO_LIST_DIR)) {
            fs.mkdirSync(this.TODO_LIST_DIR);
        }
    }
}