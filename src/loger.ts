import * as dayjs from "dayjs";
export class Loger  {
   constructor() { }
   logTip(...msg: string[]): void {
      this.log("TIP","35m",  false, ...msg);
   }
   logLink(...msg: string[]): void {
      this.log("LINK", "36m", true, ...msg);
      // console.log(`\x1B[4m\x1B[3m\x1B[36m`, msg.join(" "), `\x1B[0m`);
   }
   logErr(...msg: string[]): void {
      this.log("ERR", "31m", false, ...msg);
   }
   logWarn(...msg: string[]): void {
      this.log("WARN", "33m", false, ...msg);
   }
   logInfo(...msg: string[]): void {
      this.log("INFO", "0m", false, ...msg);
   }

   private log(title: string, color: string, link: boolean | undefined, ...msg: string[]): void {
      let text = "\x1B[36m" // 前缀起始颜色
      text += `[${this.getTimeText(Date.now())}] `; // 时间
      text += `${title ? `[${title}] ` : ""}`; // title
      text += `\x1B[${color}`; // 内容起始颜色
      text += `${link ? "\x1B[4m\x1B[3m" : ""}`;
      text += `${msg.join(" ")}`; // 内容
      text += `\x1B[0m`; // 结束颜色
      console.log(text);
   }

   private getTimeText(dateTime: number): string {
      return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss SSS");
   }
}
