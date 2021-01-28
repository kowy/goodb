import tempy from "tempy"
import JsonFileSync from "./jsonFileSync"

describe("JSONFileSync", () => {
  it("should read and write", () => {
    const obj = JSON.stringify({ a: 1 })

    const filename = tempy.file()
    const file = new JsonFileSync(filename)

    // Null if file doesn't exist
    expect(file.read()).toBeNull()

    // Write obj
    expect(file.write(obj)).toBeUndefined()

    // Read obj
    expect(file.read()).toEqual(obj)
  })
})
