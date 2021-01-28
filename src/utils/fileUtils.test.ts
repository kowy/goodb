import FileUtils from "./fileUtils"
import del from "del"
import * as fs from "fs"

describe("FileUtils", () => {
  const TEST_DIRECTORY = "./first/second/third"

  test("can create nested directory", () => {
    FileUtils.createDirectoryIfNotExists(TEST_DIRECTORY)

    expect(() => fs.accessSync(TEST_DIRECTORY)).not.toThrow()
  })

  test("can skip existing directory", () => {
    FileUtils.createDirectoryIfNotExists(TEST_DIRECTORY)
  })

  afterAll(() => {
    del.sync(["./first/**", "./first"])
  })
})
