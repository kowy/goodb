import MapSerializerAsync from "./mapSerializerAsync"
import { createComplexMap, createSimpleMap, validateComplexMap, validateSimpleMap } from "./serializerTestBase"

describe("MapSerializerAsync", () => {
  it("can serialize empty map", async () => {
    const serializer = new MapSerializerAsync()

    const map = createSimpleMap()
    const result = await serializer.serialize(map).then((serializedMap) => serializer.parse(serializedMap))

    validateSimpleMap(result)
  })

  it("can serialize complex map", async () => {
    const map = createComplexMap()

    const serializer = new MapSerializerAsync()
    const result = await serializer.serialize(map).then((serializedMap) => serializer.parse(serializedMap))

    validateComplexMap(result)
  })
})
