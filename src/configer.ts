import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { Loger, Printer } from "./types";

type VarName = keyof typeof VARIABLES_INFO;
type Value = string;
type Description = string;

const VARIABLES_INFO:Record<string,Description> = {
    table: "表",
    author: "作者"
}

type LocalConfig = Record<VarName, Value>;
const DEFAULT_CONFIG: LocalConfig = {
    table: "default",
    author: "default"
}


// type Var = {
//     name: keyof typeof VARIABLES_INFO
//     description: string
// }

export class Configer {
    private _configs: LocalConfig = DEFAULT_CONFIG;

    constructor(
        private _loger: Loger,
        private _printer: Printer
    ) {
        this.checkLocal();
    }

    get vars(): Record<keyof typeof VARIABLES_INFO, Description> {
        return VARIABLES_INFO;
    }

    get configs(): LocalConfig {
        return this._configs;
    }

    setConfig(key: VarName, value: Value) {

    }

    getConfig(key: VarName): Value {
        return ""
    }
    
    private checkLocal(){
        const DIR_NAME = ".todo";

        const configFile = path.join(os.homedir(), DIR_NAME);
        if (!fs.existsSync(configFile)){
            fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG, null, "  "));
        }
        else{
            const data: LocalConfig = JSON.parse(fs.readFileSync(configFile).toString()) as LocalConfig;
            this._configs = data;
        }
    }
}


