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
// type Var = {
//     name: keyof typeof VARIABLES_INFO
//     description: string
// }

export class Configer {
    private _configs: LocalConfig = DEFAULT_CONFIG;
    private readonly _CONFIG_PATH: string;

    constructor(
        private _loger: Loger,
        private _printer: Printer
    ) {
        this._CONFIG_PATH = path.join(os.homedir(), ".todo");

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
    }

    getConfig(key: VarName): Value {
        return this._configs[key];
    }
    
    private checkLocal(){
        if (fs.existsSync(this._CONFIG_PATH)) {
            const data: LocalConfig = JSON.parse(fs.readFileSync(this._CONFIG_PATH).toString()) as LocalConfig;
            this._configs = data;
        }
    }

    private syncConfigToLocal() {
        fs.writeFileSync(this._CONFIG_PATH, JSON.stringify(this._configs, null, "  "));
    }
}


