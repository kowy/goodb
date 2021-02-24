import SortUtils from "./sortUtils"
import dataWell from "../tests/dataWell"

describe("SortUtils", () => {
  test("can sort by attribute name", () => {
    const docs = dataWell.evenMoreDocs()
    const result = SortUtils.sort(docs, "stringAttr")

    expect(result.map((it) => it.stringAttr)).toEqual(["String-1", "String-2", "String-3", "String1", "String2", "String3"])
  })

  test("does not fail if unknown attribute provided", () => {
    const docs = dataWell.evenMoreDocs()
    const result = SortUtils.sort(docs, "unknownAttribute")

    // expect original array
    expect(result.map((it) => it.stringAttr)).toEqual(["String3", "String2", "String1", "String-1", "String-2", "String-3"])
  })

  test("can sort by comparator object", () => {
    const docs = dataWell.evenMoreDocs()
    const result = SortUtils.sort(docs, { stringAttr: "asc" })
    expect(result.map((it) => it.stringAttr)).toEqual(["String-1", "String-2", "String-3", "String1", "String2", "String3"])

    const result2 = SortUtils.sort(docs, { stringAttr: "desc" })
    expect(result2.map((it) => it.stringAttr)).toEqual(["String3", "String2", "String1", "String-3", "String-2", "String-1"])
  })

  test("can sort by multiple comparator objects", () => {
    const docs = dataWell.evenMoreDocs()
    const result = SortUtils.sort(docs, { boolAttr: "asc", numberAttr: "desc" })
    expect(result.map((it) => it.stringAttr)).toEqual(["String-3", "String-1", "String2", "String-2", "String1", "String3"])

    const result2 = SortUtils.sort(docs, { boolAttr: "asc", unknownAttr: "desc", numberAttr: "desc" })
    expect(result2.map((it) => it.stringAttr)).toEqual(["String-3", "String-1", "String2", "String-2", "String1", "String3"])

    const result3 = SortUtils.sort(docs, { boolAttr: "desc", numberAttr: "asc" })
    expect(result3.map((it) => it.stringAttr)).toEqual(["String3", "String1", "String-2", "String2", "String-1", "String-3"])
  })

  test("can sort by custom comparator function", () => {
    const docs = dataWell.evenMoreDocs()
    // sort by last character
    const result = SortUtils.sort(docs, (a: any, b: any) => {
      const astr: string = a.stringAttr
      const bstr: string = b.stringAttr
      return astr.slice(-1).localeCompare(bstr.slice(-1))
    })
    expect(result.map((it) => it.stringAttr)).toEqual(["String1", "String-1", "String2", "String-2", "String3", "String-3"])
  })
})
