import { nanoid } from "nanoid"
import JsonFileSync from "./persistence/adapters/jsonFileSync"
import MemorySync from "./persistence/adapters/memorySync"
import { GooDbOptions, ModificationOperationOptions } from "./dto/gooDbOptions"
import Low from "./persistence/low"
import MapSerializer from "./persistence/serializers/mapSerializer"
import FileUtils from "./utils/fileUtils"
import DatabaseUtils from "./utils/databaseUtils"
import SortUtils from "./utils/sortUtils"
import { FilterRequest, FilterResponse } from "./dto/filter"

const DB_DIRECTORY = "./db"
const SAVE_CHECK_TIMETOUT_MS = 1000
const ID_WIDTH_CHARS = 12

export default class GooDb {
  private dbName: string
  private memDb: Low<Map<string, any>>
  private db: Low<Map<string, any>>
  private isDirty = false
  private saveInProgress = false

  constructor(dbName: string, options: GooDbOptions) {
    if (!dbName || dbName.trim() === "") throw Error("Parameter dbName is mandatory")

    const opts = { root: DB_DIRECTORY, ...options }
    this.dbName = dbName.trim()

    FileUtils.createDirectoryIfNotExists(opts.root)

    const serializer = new MapSerializer()
    const fileAdapter = new JsonFileSync(`${opts.root}/${this.dbName}.json`)
    this.db = new Low<Map<string, any>>(fileAdapter, serializer)

    const memAdapter = new MemorySync()
    this.memDb = new Low<Map<string, any>>(memAdapter, serializer)

    // sync data from HDD
    this.db.read()
    this.memDb.data = this.db.data
    this.memDb.write()
  }

  findAll(): FilterResponse<any> {
    const result: FilterResponse<any> = {
      docs: [...this.memDb.read().values()],
    }

    return DatabaseUtils.addStatistics(result)
  }

  findById(id: string): unknown {
    if (!id || id.trim() === "") return undefined

    return this.memDb.read().get(id)
  }

  filter(request: FilterRequest): FilterResponse<any> {
    const filterFunctions = DatabaseUtils.getFilterFunctions(request.selector)
    const docs = [...this.memDb.read().values()].filter((doc) => DatabaseUtils.applyFilters(doc, filterFunctions))
    const result: FilterResponse<any> = { docs: docs }

    // apply sorting if set in request
    if (request.sort && result.docs.length > 0) {
      result.docs = SortUtils.sort(docs, request.sort)
    }

    // apply limit if set in request
    if (request.limit && Number.isSafeInteger(request.limit)) {
      result.docs = result.docs.slice(0, request.limit)
    }

    return DatabaseUtils.addStatistics(result)
  }

  upsert(doc: any, options?: ModificationOperationOptions): unknown {
    const opts = { consistent: false, ...options }

    const _id = doc._id && doc._id != "" ? doc._id : nanoid(ID_WIDTH_CHARS)
    doc._id = _id

    this.memDb.data.set(_id, doc)

    this._sync(opts.consistent)

    return doc
  }

  upsertAll(docs: any[], options?: ModificationOperationOptions): Array<unknown> {
    const opts = { consistent: false, ...options }

    const updatedDocs = docs.map((doc) => this.upsertOneDoc(doc))

    this._sync(opts.consistent)

    return updatedDocs
  }

  modifyById(id: string, modificatorFunction: (a: any) => any, options?: ModificationOperationOptions): unknown {
    if (!this.memDb.data.has(id)) return undefined

    const opts = { consistent: false, ...options }
    const updatedDoc = modificatorFunction(Object.assign({}, this.memDb.data.get(id)))
    // the user might change the id, so repair it
    updatedDoc._id = id
    this.memDb.data.set(id, updatedDoc)

    this._sync(opts.consistent)

    return updatedDoc
  }

  deleteById(id: string, options?: ModificationOperationOptions): boolean {
    const opts = { consistent: false, ...options }

    const result = this.memDb.data.delete(id)

    if (result) {
      this._sync(opts.consistent)
    }

    return result
  }

  private upsertOneDoc(doc: any): unknown {
    const _id = doc._id ? doc._id : nanoid(ID_WIDTH_CHARS)
    doc._id = _id

    this.memDb.data.set(_id, Object.assign({}, doc))
    return doc
  }

  private _sync(consistent: boolean) {
    this.memDb.write()
    this.isDirty = true

    if (consistent) {
      this._doSync()
    } else {
      Promise.resolve(() => {
        this._doSync()
      }).catch((reason: any) => {
        console.log(reason)
      })
    }
  }

  private _doSync() {
    if (!this.isDirty) return

    if (this.saveInProgress) {
      setTimeout(() => this._doSync(), SAVE_CHECK_TIMETOUT_MS)
    } else {
      this.saveInProgress = true
      this.db.data = this.memDb.data
      this.db.write()
      this.isDirty = false
      this.saveInProgress = false
    }
  }
}
