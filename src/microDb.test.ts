import fs from "fs"
import GooDb from "./gooDb"
import datawell from "./tests/dataWell"
import del from "del"

beforeAll(() => {
  del.sync(["./db/**", "./db"])
  del.sync(["./customPath/**", "./customPath"])
})

test("Don't create instance with empty dbName", () => {
  expect(() => new GooDb("", {})).toThrowError()
})

test("Can create DB in custom path", () => {
  const db = new GooDb("customDb", { root: "./customPath" })
  db.upsert(datawell.simpleDoc(), { consistent: true })
  const stats = fs.statSync("./customPath/customDb.json")

  expect(stats.isFile()).toBeTruthy()
})

test("Can load old data from DB", () => {
  const db = new GooDb("switchOff", {})
  db.upsert(datawell.simpleDoc(), { consistent: true })

  const db2 = new GooDb("switchOff", {})
  const result = db2.findAll()

  expect(result.docs.length).toBe(1)
  expect(result.docs[0]).toMatchObject(datawell.simpleDoc())
})

test("Can upsert multiple values", () => {
  // including statistics
  const db = new GooDb("multipleValues", {})
  db.upsertAll(datawell.multipleDocs(), { consistent: true })

  const result = db.findAll()
  expect(result.pageSize).toBe(0)
  expect(result.offset).toBe(0)
  expect(result.totalDocs).toBe(3)
  expect(result.docs.length).toBe(3)
  datawell.compareArrays(result.docs, datawell.multipleDocs())
})

test("Can update document by id", () => {
  const db = new GooDb("modifyValue", {})
  const origin: any = db.upsert(datawell.simpleDoc(), { consistent: true })

  const result1 = db.findAll()
  expect(result1.docs.length).toBe(1)
  const obj1 = result1.docs[0]
  expect(obj1.stringAttr).toBe(origin.stringAttr)
  expect(obj1.numberAttr).toBe(origin.numberAttr)
  expect(obj1.boolAttr).toBe(origin.boolAttr)
  expect(obj1.nullAttr).toBeNull()
  expect(obj1).toMatchObject(origin)

  // modify document and check upsert
  obj1.stringAttr = "Another string"
  obj1.numberAttr = 539
  obj1.boolAttr = true
  const modifiedObj: any = db.upsert(obj1, { consistent: true })

  const result2 = db.findAll()
  expect(result2.docs.length).toBe(1)
  const obj2 = result1.docs[0]
  expect(modifiedObj._id).toBe(origin._id)
  expect(obj2).toMatchObject(modifiedObj)
})

test("Can insert doc with non-existing id", () => {
  const db = new GooDb("emptyDb", {})

  const doc: any = datawell.simpleDoc()
  const ID = "000000000000x"
  doc._id = ID

  db.upsert(doc)
  const result = db.findById(ID)
  expect(result).toMatchObject({
    _id: ID,
    stringAttr: "String Attribute with diacritics ěščřžýáíé",
    numberAttr: 935,
    boolAttr: false,
    nullAttr: null,
  })
})

test("Can modify values by id", () => {
  const db = new GooDb("modifyFunction", {})
  const originDocs: any = db.upsertAll(datawell.multipleDocs(), { consistent: true })

  // modify document by modify function
  const modifiedDocument: any = db.modifyById(originDocs[0]._id, (doc: any) => {
    doc.stringAttr += " modified"
    doc.numberAttr += 5
    return doc
  })

  const result2 = db.findAll()
  expect(result2.docs.length).toBe(3)
  expect(result2.docs[1]).toMatchObject(originDocs[1])
  expect(result2.docs[2]).toMatchObject(originDocs[2])
  expect(result2.docs[0]).toMatchObject(modifiedDocument)
  expect(result2.docs[0].stringAttr).toBe("String3 modified")
  expect(result2.docs[0].numberAttr).toBe(16)

  const result3 = db.modifyById("non-existing", () => {
    throw new Error("Should not go here")
  })
  expect(result3).toBeUndefined()
})

test("Can find document by id", () => {
  const db = new GooDb("docById", {})
  const originDocs: any = db.upsertAll(datawell.multipleDocs(), { consistent: true })

  const foundDocument = db.findById(originDocs[0]._id)
  expect(foundDocument).toMatchObject(originDocs[0])

  const notFoundDocument = db.findById(" non-existing ")
  expect(notFoundDocument).toBeUndefined()

  const emptyString = db.findById("")
  expect(emptyString).toBeUndefined()
})

test("Can delete document by id", () => {
  const db = new GooDb("deleteDocById", {})
  const originDocs: any = db.upsertAll(datawell.multipleDocs(), { consistent: true })

  db.deleteById(originDocs[0]._id)
  const afterDelete1 = db.findAll()
  expect(afterDelete1.totalDocs).toBe(2)
  expect(afterDelete1.docs.length).toBe(2)

  db.deleteById(originDocs[1]._id)
  const afterDelete2 = db.findAll()
  expect(afterDelete2.totalDocs).toBe(1)
  expect(afterDelete2.docs.length).toBe(1)
  expect(afterDelete2.docs[0]).toMatchObject(originDocs[2])

  db.deleteById(originDocs[2]._id)
  const afterDelete3 = db.findAll()
  expect(afterDelete3.totalDocs).toBe(0)
  expect(afterDelete3.docs.length).toBe(0)

  const notFoundDocument = db.findById(" non-existing ")
  expect(notFoundDocument).toBeUndefined()

  const emptyString = db.findById("")
  expect(emptyString).toBeUndefined()
})

test("Can filter documents", () => {
  const db = new GooDb("filter", {})
  const originDocs: any = db.upsertAll(datawell.multipleDocs(), { consistent: true })

  // test filtering by Selector and sorting by Sorter object
  const foundDocs = db.filter({
    selector: { boolAttr: { $eq: false } },
    sort: { numberAttr: "desc" },
  })

  expect(foundDocs.totalDocs).toBe(2)
  expect(foundDocs.docs[0]).toMatchObject(originDocs[2])
  expect(foundDocs.docs[1]).toMatchObject(originDocs[0])

  // test filtering by variable
  const boolVariable = { $eq: false }
  const stringVariable = "good"
  const directionVariable = "desc"
  const foundByVariable = db.filter({
    selector: { boolAttr: boolVariable, anotherString: stringVariable },
    sort: { numberAttr: directionVariable },
  })
  expect(foundByVariable.totalDocs).toBe(2)
  expect(foundByVariable.docs[0]).toMatchObject(originDocs[2])
  expect(foundByVariable.docs[1]).toMatchObject(originDocs[0])

  // test filtering by function and sorting by attribute name (default ascending sorting)
  const foundByFunction = db.filter({
    selector: (a: any) => a.numberAttr >= 11,
    sort: "stringAttr",
  })
  expect(foundByFunction.totalDocs).toBe(3)
  expect(foundByFunction.docs.length).toBe(3)
  expect(foundByFunction.docs[0]).toMatchObject(originDocs[2])
  expect(foundByFunction.docs[1]).toMatchObject(originDocs[1])
  expect(foundByFunction.docs[2]).toMatchObject(originDocs[0])

  // test filtering by value and sorting by comparator function
  const foundByValue = db.filter({
    selector: { anotherString: "good" },
    sort: (a: any, b: any) => {
      // sort by boolAttr, then by stringValue
      if (a.boolAttr && !b.boolAttr) {
        return -1
      } else if (!a.boolAttr && b.boolAttr) {
        return 1
      } else {
        const aValue: string = a.stringAttr
        const bValue: string = b.stringAttr
        return aValue.localeCompare(bValue)
      }
    },
  })
  expect(foundByValue.totalDocs).toBe(3)
  expect(foundByValue.docs.length).toBe(3)
  expect(foundByValue.docs[0]).toMatchObject(originDocs[1])
  expect(foundByValue.docs[1]).toMatchObject(originDocs[2])
  expect(foundByValue.docs[2]).toMatchObject(originDocs[0])

  // test limiting
  const foundLimited = db.filter({
    selector: {},
    limit: 1,
  })
  expect(foundLimited.totalDocs).toBe(1)
  expect(foundLimited.docs.length).toBe(1)

  // test overlapping limit
  const foundNonLimited = db.filter({
    selector: {},
    limit: 99,
  })
  expect(foundNonLimited.totalDocs).toBe(3)
  expect(foundNonLimited.docs.length).toBe(3)
})
