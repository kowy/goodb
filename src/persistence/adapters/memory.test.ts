import Memory from "./memory"

describe("Memory", () => {
  it("should read and write", async () => {
    const obj = JSON.stringify({ a: 1 })

    const memory = new Memory()

    // Null by default
    expect(await memory.read()).toBeNull()

    // Write obj
    expect(await memory.write(obj)).toBeUndefined()

    // Read obj
    expect(await memory.read()).toEqual(obj)
  })
})
