export function createSimpleMap(): Map<string, any> {
  return new Map<string, any>()
}

export function createComplexMap(): Map<string, any> {
  const map = new Map<string, any>()
  map.set("string value", "simple value")
  map.set("number value", 68423)
  map.set("boolean value", true)
  map.set("null value", null)
  map.set("complex value", [
    { id: 123, name: "Jara", lastName: "Cimrman" },
    { id: 555, name: "Pantata", lastName: "Bezousek" },
  ])

  return map
}

export function createComplexObject(): unknown {
  return {
    string_value: "simple value",
    number_value: 68423,
    boolean_value: true,
    null_value: null,
    complex_value: [
      { id: 123, name: "Jara", lastName: "Cimrman" },
      { id: 555, name: "Pantata", lastName: "Bezousek" },
    ],
  }
}

export function validateSimpleMap(result: Map<string, any>): void {
  expect(result.size).toBe(0)
}

export function validateComplexMap(result: Map<string, any>): void {
  expect(result.get("string value")).toMatch("simple value")
  expect(result.get("number value")).toBe(68423)
  expect(result.get("boolean value")).toBe(true)
  expect(result.get("null value")).toBeNull()
  expect(result.get("complex value").length).toBe(2)
  expect(result.get("complex value")[0]).toMatchObject({
    id: 123,
    name: "Jara",
    lastName: "Cimrman",
  })
  expect(result.get("complex value")[1]).toMatchObject({
    id: 555,
    name: "Pantata",
    lastName: "Bezousek",
  })
}

export function validateComplexObject(result: any): void {
  expect(result.string_value).toMatch("simple value")
  expect(result.number_value).toBe(68423)
  expect(result.boolean_value).toBe(true)
  expect(result.null_value).toBeNull()
  expect(result.complex_value.length).toBe(2)
  expect(result.complex_value[0]).toMatchObject({
    id: 123,
    name: "Jara",
    lastName: "Cimrman",
  })
  expect(result.complex_value[1]).toMatchObject({
    id: 555,
    name: "Pantata",
    lastName: "Bezousek",
  })
}
