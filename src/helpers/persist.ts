import {existsSync, readFileSync, writeFileSync} from "fs";


export default class Persist {
  filename: string;
  data: Record<string, unknown> = {};

  constructor(filename: string) {
    this.filename = filename;
    if (existsSync(filename)) {
      this.data = JSON.parse(readFileSync(this.filename, {encoding: 'utf-8'}))
    }

    if (!this.data) {
      this.data = {}
    }
  }

  public get<T = string>(name: string, value: T): T | undefined {
    return (this.data[name] ?? value) as unknown as T;
  }

  public save(data: Record<string, unknown>) {
    this.data = {...this.data, ...data};
    writeFileSync(this.filename, JSON.stringify(this.data, null, "  "), {encoding: "utf-8"})
  }
}
