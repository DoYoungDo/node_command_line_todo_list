import { widthOfStr } from "./utils";

const COLOR = {
    'bright'    : '\x1B[1m', // 亮色
    'grey'      : '\x1B[2m', // 灰色
    'italic'    : '\x1B[3m', // 斜体
    'underline' : '\x1B[4m', // 下划线
    'reverse'   : '\x1B[7m', // 反向
    'hidden'    : '\x1B[8m', // 隐藏
    'black'     : '\x1B[30m', // 黑色
    'red'       : '\x1B[31m', // 红色
    'green'     : '\x1B[32m', // 绿色
    'yellow'    : '\x1B[33m', // 黄色
    'blue'      : '\x1B[34m', // 蓝色
    'magenta'   : '\x1B[35m', // 品红
    'cyan'      : '\x1B[36m', // 青色
    'white'     : '\x1B[37m', // 白色
    'blackBG'   : '\x1B[40m', // 背景色为黑色
    'redBG'     : '\x1B[41m', // 背景色为红色
    'greenBG'   : '\x1B[42m', // 背景色为绿色
    'yellowBG'  : '\x1B[43m', // 背景色为黄色
    'blueBG'    : '\x1B[44m', // 背景色为蓝色
    'magentaBG' : '\x1B[45m', // 背景色为品红
    'cyanBG'    : '\x1B[46m', // 背景色为青色
    'whiteBG'   : '\x1B[47m' // 背景色为白色
}

export interface PrintTableOptions {
    titleAlign?: "left" | "right" | "center";
    align?: "left" | "right" | "center";
    color?: "red" | "green" | "blue";
    backgroundColor?: "redBG" | "greenBG" | "blueBG";
}

export class Printer {
    constructor(){
        process.stdout.setEncoding("utf-8");
    }

    printTable(tabularData: any[], properties?: readonly string[], options?: PrintTableOptions[]): void {
        // 标题合并去重
        properties = properties || [...new Set(tabularData.map(line => Object.keys(line)).reduce((p, c) => p.concat(c)))]
        // 计算每一列的宽度
        let columnWidth: number[] = [properties.map(colunm => widthOfStr(colunm)), ...tabularData.map(line => Object.keys(line).map(key => widthOfStr(line[key])))].reduce((p: number[], c: number[]) => (p.length > c.length ? p : c).map((_, index) => Math.max(p[index], c[index])))//.map(w => w + 2);
        // 组织表格文本
        let list: string[] = []
        let lines = properties.map((t,i)=>"─".repeat(columnWidth[i]+2));
        list.push("┌" + lines.join("┬") + "┐") // 表格上边框
        list.push("│ " + properties.map((l, i) => completeStr(l, columnWidth[i], options?.[i]?.align || "center")).join(" │ ") + " │") // 表格标题
        list.push("│" + lines.join("┼") + "│") // 表格标题内容分隔线
        // 表格内容
        tabularData.forEach(line=>{
            list.push("│ " + properties!.map((t, i) => `${options?.[i]?.color ? COLOR[options?.[i]?.color!] : ""}${completeStr(`${line[t]}`, columnWidth[i], options?.[i]?.align || "left")}${options?.[i]?.color ? "\x1B[0m" : ""}`).join(" │ ") + " │");
        })
        list.push("└" + lines.join("┴") + "┘") // 表格下边框
        console.log(list.join("\n"));
        // console.table(tabularData, properties);

        function completeStr(str: string, width: number, align: "left" | "right" | "center" = "left"): string {
            // let w = Math.max(width,widthOfStr(str))
            let len = width - widthOfStr(str);
            if(len > 0){
                switch (align){
                    case "left":
                        return `${str}${" ".repeat(len)}`;
                    case "center":
                        let leftLen = Math.floor(len / 2);
                        return `${" ".repeat(leftLen)}${str}${" ".repeat(len - leftLen)}`;
                    case "right":
                        return `${" ".repeat(len)}${str}`;
                }
            }

            return  str;
        }
    }

    printLine(...line: any[]): void {
        console.log(...line);
    }
}

// ┌─────┐
// │┼┼┼┼┼│
// ├┼┼┼┼┼┤
// └ → ← ┘
