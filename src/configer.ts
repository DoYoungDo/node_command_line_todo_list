import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { Loger, Printer } from "./types";

type VarName = Var;
type Value = string;
type Description = string;

const VARIABLES_INFO: Record<VarName, Description> = {
    table: "表",
    author: "作者"
}

type LocalConfig = Record<VarName, Value>;
const DEFAULT_CONFIG: LocalConfig = {
    table: "default",
    author: "default"
}

export enum Var {
    TABLE = "table",
    AUTHOR = "author"
}

const HISTORY: Record<string, string[]> = {
    table_list: ["default"],
    author_list: ["default"]
}

export class Configer {
    private readonly _CONFIG_DIR: string;
    private readonly _CONFIG_TODO_PATH: string;
    private readonly _CONFIG_HISTORY_PATH: string;
    private _configs: LocalConfig = DEFAULT_CONFIG;
    private _history = HISTORY;

    constructor(
        private _loger: Loger,
    ) {
        this._CONFIG_DIR= path.join(os.homedir(), ".todo");
        this._CONFIG_TODO_PATH = path.join(this._CONFIG_DIR, ".todo");
        this._CONFIG_HISTORY_PATH = path.join(this._CONFIG_DIR, ".history");

        this.checkLocal();
    }

    get vars(): Record<Var, Description> {
        return VARIABLES_INFO;
    }

    get configs(): LocalConfig {
        return this._configs;
    }

    setConfig(key: VarName, value: Value) {
        this._configs[key] = value;
        this.syncConfigToLocal();

        const keyList = `${key}_list`;
        if (this._history[keyList] && !this._history[keyList].includes(value)) {
            this._history[keyList].push(value);
            this.syncHistoryToLocal();
        }
    }

    getConfig(key: VarName): Value {
        return this._configs[key];
    }

    getHistory(key: VarName): Value[] {
        return this._history[`${key}_list`] ?? [];
    }
    
    private checkLocal(){
        if (!fs.existsSync(this._CONFIG_DIR)) {
            fs.mkdirSync(this._CONFIG_DIR, { recursive: true });
        }

        if (fs.existsSync(this._CONFIG_TODO_PATH)) {
            const data: LocalConfig = JSON.parse(fs.readFileSync(this._CONFIG_TODO_PATH).toString()) as LocalConfig;
            this._configs = data;
        }

        if (fs.existsSync(this._CONFIG_HISTORY_PATH)) {
            const data = JSON.parse(fs.readFileSync(this._CONFIG_HISTORY_PATH).toString());
            this._history = data;
        }
    }

    private syncConfigToLocal() {
        fs.writeFileSync(this._CONFIG_TODO_PATH, JSON.stringify(this._configs, null, "  "));
    }
    private syncHistoryToLocal() {
        fs.writeFileSync(this._CONFIG_HISTORY_PATH, JSON.stringify(this._history, null, "  "));
    }
}


