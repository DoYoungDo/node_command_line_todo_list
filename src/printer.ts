export class Printer {
    constructor(){
        process.stdout.setEncoding("utf-8");
    }

    printTable(tabularData: any[], properties?: readonly string[],showIndex:boolean = true):void {
        console.table(tabularData, properties);
    }

    printLine(...line: any[]): void {
        console.log(...line);
    }
}

// ┌─────┐
// │┼┼┼┼┼│
// ├┼┼┼┼┼┤
// └ → ← ┘
