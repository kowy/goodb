import tempy from "tempy"
import JsonFile from "./jsonFile"

describe("JsonFile", () => {
  it("should read and write", async () => {
    const obj = JSON.stringify({ a: 1 })

    const filename = tempy.file()
    const file = new JsonFile(filename)

    // Null if file doesn't exist
    expect(await file.read()).toBeNull()

    // Write obj
    expect(await file.write(obj)).toBeUndefined()

    // Read obj
    expect(await file.read()).toEqual(obj)
  })

  it("should preserve order", async () => {
    const filename = tempy.file()
    const file = new JsonFile(filename)
    const promises = []

    let i
    for (i = 0; i <= 100; i++) {
      promises.push(file.write(i))
    }

    await Promise.all(promises)

    expect(await file.read()).toEqual((i - 1).toString())
  })
})
