import fs from "fs"
import mutexify from "mutexify"
import writeFileAtomic from "write-file-atomic"
import { IAdapterAsync } from "../lowAsync"

export default class JsonFile implements IAdapterAsync {
  public file: string
  private lock = mutexify()

  constructor(file: string) {
    this.file = file
  }

  public read(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(this.file, (err, data) => {
        if (err) {
          // File doesn't exist
          if (err.code === "ENOENT") {
            return resolve(null)
          }

          // Other errors
          return reject(err)
        }

        resolve(data.toString())
      })
    })
  }

  public write(data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Lock file
      this.lock((release) => {
        // Write atomically
        writeFileAtomic(this.file, data, (err) => {
          // Release file
          release()

          if (err) {
            return reject(err)
          }

          resolve()
        })
      })
    })
  }
}
