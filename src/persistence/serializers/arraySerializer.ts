import { ISerializer } from "../low"

export default class ArraySerializer implements ISerializer {
  serialize(data: any): string {
    return JSON.stringify(data)
  }

  parse(data: string): any {
    return JSON.parse(data)
  }

  emptyData(): any {
    return []
  }
}
