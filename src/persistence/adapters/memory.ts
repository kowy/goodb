import { IAdapterAsync } from "../lowAsync"

export default class Memory implements IAdapterAsync {
  private data = null

  public read(): Promise<any> {
    return Promise.resolve(this.data)
  }

  public write(data: any): Promise<void> {
    this.data = data
    return Promise.resolve()
  }
}
