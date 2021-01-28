import { IAdapter } from "../low"

export default class Memory implements IAdapter {
  private data = null

  public read(): any {
    return this.data
  }

  public write(data: any): void {
    this.data = data
  }
}
