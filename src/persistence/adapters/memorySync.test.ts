import MemorySync from "./memorySync"

describe("MemorySync", () => {
  it("should read and write", () => {
    const obj = JSON.stringify({ a: 1 })

    const memory = new MemorySync()

    // Null by default
    expect(memory.read()).toBeNull()

    // Write obj
    expect(memory.write(obj)).toBeUndefined()

    // Read obj
    expect(memory.read()).toEqual(obj)
  })
})
