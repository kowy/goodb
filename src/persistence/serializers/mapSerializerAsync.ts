import { ISerializerAsync } from "../lowAsync"

export default class MapSerializerAsync implements ISerializerAsync {
  serialize(data: any): Promise<string> {
    return Promise.resolve(JSON.stringify([...data]))
  }

  parse(data: string): Promise<any> {
    return Promise.resolve(new Map(JSON.parse(data)))
  }

  emptyObject(): Map<any, any> {
    return new Map()
  }
}
