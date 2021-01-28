import { ISerializerAsync } from "../lowAsync"

export default class ArraySerializerAsync implements ISerializerAsync {
  serialize(data: any): Promise<string> {
    return Promise.resolve(JSON.stringify(data))
  }

  parse(data: string): Promise<any> {
    return Promise.resolve(JSON.parse(data))
  }

  emptyObject(): any {
    return []
  }
}
