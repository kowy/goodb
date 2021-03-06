import LocalStorage from "./localStorage"

describe("LocalStorage", () => {
  it("should read and write", () => {
    const obj = JSON.stringify({ a: 1 })
    const storage = new LocalStorage("key")

    // Write obj
    expect(storage.write(obj)).toBeUndefined()

    // Read obj
    expect(storage.read()).toEqual(obj)
  })
})
