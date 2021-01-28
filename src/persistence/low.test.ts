import fs from "fs"
import tempy from "tempy"
import Low from "./low"
import JSONFileAdapter from "./adapters/jsonFileSync"
import MapSerializer from "./serializers/mapSerializer"
import ArraySerializer from "./serializers/arraySerializer"
import { createSimpleMap } from "./serializers/serializerTestBase"

interface IData {
  a?: number
  b?: number
}

function createJSONFile(obj: IData) {
  const file = tempy.file()
  fs.writeFileSync(file, JSON.stringify(obj))
  return file
}

describe("Low", () => {
  test("set default serializer and adapter if not provided", () => {
    // Create JSON file
    const obj = { a: 1, b: 2 }
    const low = new Low<IData>()
    low.data = obj
    low.write()
    const dbData = low.read()

    expect(dbData).toMatchObject(obj)
  })

  test("reads and writes object to JSON file", () => {
    // Create JSON file
    const obj = { a: 1 }
    const file = createJSONFile(obj)

    // Init
    const adapter = new JSONFileAdapter(file)
    const serializer = new ArraySerializer()
    const low = new Low<IData>(adapter, serializer)
    const dbData = low.read()

    // Data should equal file content
    expect(dbData).toEqual(obj)

    // Write new data
    const newObj = { b: 2 }
    low.data = newObj
    low.write()

    // File content should equal new data
    const data = fs.readFileSync(file).toString()
    expect(JSON.parse(data)).toEqual(newObj)
  })

  test("reads and writes Map serializers", () => {
    // Create simple map
    const obj = createSimpleMap()
    obj.set("first item", "1")
    const file = tempy.file()

    // Init
    const adapter = new JSONFileAdapter(file)
    const serializer = new MapSerializer()
    const low = new Low<Map<string, any>>(adapter, serializer)
    low.data = obj
    low.write()

    const dbData = low.read()

    // Data should equal file content
    expect(dbData).toEqual(obj)

    // Write new data
    low.data.set("second item", "secItem")
    low.write()

    // File content should equal new data
    const dbData2 = low.read()
    expect(dbData2).toEqual(
      new Map([
        ["first item", "1"],
        ["second item", "secItem"],
      ])
    )
  })
})
