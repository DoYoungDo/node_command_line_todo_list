import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { File } from "./utils";

export type Config = {
    table: string,
    tables: string[]
}

export class Setting {
    static readonly TOTO_HOME_DIR = path.join(os.homedir(), ".todo");
    static readonly TODO_LIST_DIR = path.join(this.TOTO_HOME_DIR, "todos");
    static readonly TODO_SETTING_FILE_PATH = path.join(this.TOTO_HOME_DIR, "setting");

    static get config() :Config{
        return new File<Config>(this.TODO_SETTING_FILE_PATH).create({
            table: "default",
            tables: ["default"]
        }).read();
    }

    static set config(cfg: Config) {
        new File<Config>(this.TODO_SETTING_FILE_PATH).write(cfg);
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