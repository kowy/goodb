import MemorySync from "./adapters/memorySync"
import ArraySerializer from "./serializers/arraySerializer"

export interface IAdapter {
  read: () => any
  write: (data: any) => void
}

export interface ISerializer {
  serialize: (data: any) => string
  parse: (data: string) => any
  emptyData: () => any
}

export default class Low<T = any> {
  private adapter: IAdapter
  private serializer: ISerializer
  public data: T

  constructor(adapter?: IAdapter, serializer?: ISerializer) {
    this.adapter = adapter || new MemorySync()
    this.serializer = serializer || new ArraySerializer()
    this.data = this.serializer.emptyData()
  }

  public read(): T {
    const serializedData = this.adapter.read()
    this.data = this.serializer.parse(serializedData)
    return this.data
  }

  public write(): void {
    const serializedData = this.serializer.serialize(this.data)
    return this.adapter.write(serializedData)
  }
}
