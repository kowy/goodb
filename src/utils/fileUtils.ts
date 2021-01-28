import fs from "fs"

export default class FileUtils {
  public static createDirectoryIfNotExists(dir: string): void {
    try {
      fs.accessSync(dir, fs.constants.F_OK)
    } catch (ignore) {
      console.log(`DB directory '${dir}' is missing => need to be created`)
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}
