import fs from "fs"
import tempy from "tempy"
import JSONFileAdapter from "./adapters/jsonFile"
import LowAsync from "./lowAsync"
import ArraySerializerAsync from "./serializers/arraySerializerAsync"
import MapSerializerAsync from "./serializers/mapSerializerAsync"
import { createSimpleMap } from "./serializers/serializerTestBase"

interface IData {
  a?: number
  b?: number
}

function createJSONFile(obj: IData): string {
  const file = tempy.file()
  fs.writeFileSync(file, JSON.stringify(obj))
  return file
}

describe("LowAsync", () => {
  test("set default serializer and adapter if not provided", async () => {
    // Create JSON file
    const obj = { a: 1, b: 2 }
    const low = new LowAsync<IData>()
    low.data = obj
    await low.write()
    const dbData = await low.read()

    expect(dbData).toMatchObject(obj)
  })

  test("reads and writes object to LocalStorage", async () => {
    // Create JSON file
    const obj = { a: 1 }
    const file = createJSONFile(obj)

    // Init
    const adapter = new JSONFileAdapter(file)
    const serializer = new ArraySerializerAsync()
    const low = new LowAsync<IData>(adapter, serializer)
    const dbData = await low.read()

    // Data should equal file content
    expect(dbData).toEqual(obj)

    // Write new data
    const newObj = { b: 2 }
    low.data = newObj
    await low.write()

    // File content should equal new data
    const data = fs.readFileSync(file).toString()
    expect(JSON.parse(data)).toEqual(newObj)
  })

  test("reads and writes Map serializers", async () => {
    // Create simple map
    const obj = createSimpleMap()
    obj.set("first item", "1")
    const file = tempy.file()

    // Init
    const adapter = new JSONFileAdapter(file)
    const serializer = new MapSerializerAsync()
    const low = new LowAsync<Map<string, any>>(adapter, serializer)
    low.data = obj
    await low.write()

    const dbData = await low.read()

    // Data should equal file content
    expect(dbData).toEqual(obj)

    // Write new data
    low.data.set("second item", "secItem")
    await low.write()

    // File content should equal new data
    const dbData2 = await low.read()
    expect(dbData2).toMatchObject(
      new Map([
        ["first item", "1"],
        ["second item", "secItem"],
      ])
    )
  })
})
