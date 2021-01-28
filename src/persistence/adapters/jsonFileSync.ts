import fs from "fs"
import writeFileAtomic from "write-file-atomic"
import { IAdapter } from "../low"

export default class JsonFileSync implements IAdapter {
  public file: string

  constructor(file: string) {
    this.file = file
  }

  public read(): any {
    if (!fs.existsSync(this.file)) {
      return null
    }

    return fs.readFileSync(this.file).toString()
  }

  public write(data: any): any {
    writeFileAtomic.sync(this.file, data)
  }
}
