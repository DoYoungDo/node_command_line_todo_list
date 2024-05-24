import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { Loger } from "./loger";

export enum BuiltinConfigVariable {
    TABLE = "table",
    AUTHOR = "author"
}

export const BuiltinConfigVariableDescription: Record<BuiltinConfigVariable, string> = {
    table: "表",
    author: "作者"
}

type LocalConfig = Record<BuiltinConfigVariable, string>;
const DEFAULT_CONFIG: LocalConfig = {
    table: "default",
    author: "default"
}

const DEFAULT_HISTORY: Record<BuiltinConfigVariable, string[]> = {
    table: ["default"],
    author: ["default"]
}

export class Configer {
    private readonly _CONFIG_DIR: string;
    private readonly _CONFIG_TODO_PATH: string;
    private readonly _CONFIG_HISTORY_PATH: string;
    private _configs: LocalConfig = DEFAULT_CONFIG;
    private _history = DEFAULT_HISTORY;

    constructor(
        private _loger: Loger,
    ) {
        this._CONFIG_DIR= path.join(os.homedir(), ".todo");
        this._CONFIG_TODO_PATH = path.join(this._CONFIG_DIR, ".todo");
        this._CONFIG_HISTORY_PATH = path.join(this._CONFIG_DIR, ".history");

        this.checkLocal();
    }

    get configs(): LocalConfig {
        return this._configs;
    }

    setConfig(key: BuiltinConfigVariable, value: string) {
        this._configs[key] = value;
        if(key === BuiltinConfigVariable.AUTHOR){
            this._configs[BuiltinConfigVariable.TABLE] = DEFAULT_CONFIG.table;
        }

        this.syncConfigToLocal();

        if (this._history[key] && !this._history[key].includes(value)) {
            this._history[key].push(value);
            this.syncHistoryToLocal();
        }
    }

    getConfig(key: BuiltinConfigVariable): string {
        return this._configs[key];
    }

    getHistory(key: BuiltinConfigVariable): string[] {
        return this._history[key] ?? [];
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


