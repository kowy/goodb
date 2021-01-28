import { ISerializer } from "../low"

export default class MapSerializer implements ISerializer {
  serialize(data: any): string {
    return JSON.stringify([...data])
  }

  parse(data: string): any {
    return new Map(JSON.parse(data))
  }

  emptyData(): any {
    return new Map()
  }
}
