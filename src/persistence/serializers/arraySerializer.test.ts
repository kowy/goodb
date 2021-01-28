import ArraySerializer from "./arraySerializer"
import { createComplexObject, validateComplexObject } from "./serializerTestBase"

describe("ArraySerializer", () => {
  it("can serialize empty object", () => {
    const serializer = new ArraySerializer()

    const obj = {}
    const serializedObj = serializer.serialize(obj)
    const result = serializer.parse(serializedObj)

    expect(result).toMatchObject({})
  })

  it("can serialize complex object", () => {
    const obj = createComplexObject()

    const serializer = new ArraySerializer()
    const serializedObj = serializer.serialize(obj)
    const result = serializer.parse(serializedObj)

    validateComplexObject(result)
  })
})
