import ArraySerializerAsync from "./arraySerializerAsync"
import { createComplexObject, validateComplexObject } from "./serializerTestBase"

describe("ObjectSerializerAsync", () => {
  it("can serialize empty object", async () => {
    const serializer = new ArraySerializerAsync()

    const obj = {}
    const serializedObj = await serializer.serialize(obj)
    const result = await serializer.parse(serializedObj)

    expect(result).toMatchObject({})
  })

  it("can serialize complex object", async () => {
    const obj = createComplexObject()

    const serializer = new ArraySerializerAsync()
    const serializedObj = await serializer.serialize(obj)
    const result = await serializer.parse(serializedObj)

    validateComplexObject(result)
  })
})
