import Memory from "./adapters/memory"
import ArraySerializerAsync from "./serializers/arraySerializerAsync"

export interface IAdapterAsync {
  read: () => Promise<any>
  write: (data: any) => Promise<void>
}

export interface ISerializerAsync {
  serialize: (data: any) => Promise<string>
  parse: (data: string) => Promise<any>
  emptyObject: () => any
}

export default class LowAsync<T = any> {
  public adapter: IAdapterAsync
  public serializer: ISerializerAsync
  public data: T

  constructor(adapter?: IAdapterAsync, serializer?: ISerializerAsync) {
    this.adapter = adapter || new Memory()
    this.serializer = serializer || new ArraySerializerAsync()

    this.data = this.serializer.emptyObject()
  }

  public async read(): Promise<T> {
    const serializedData = await this.adapter.read()
    this.data = await this.serializer.parse(serializedData)
    return this.data
  }

  public async write(): Promise<void> {
    const serializedData = await this.serializer.serialize(this.data)
    await this.adapter.write(serializedData)
  }
}
