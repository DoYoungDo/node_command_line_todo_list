export class Printer {

    printTable(tabularData: any, properties?: readonly string[],showIndex:boolean = true):void {
        console.table(tabularData, properties);
    }

    printLine(line:any):void{
        console.log(line);
    }
}

// ┌─────┐
// │┼┼┼┼┼│
// ├┼┼┼┼┼┤
// └ → ← ┘
