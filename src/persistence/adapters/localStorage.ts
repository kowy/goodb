import { IAdapter } from "../low"

export default class LocalStorage implements IAdapter {
  public key: string

  constructor(key: string) {
    this.key = key
  }

  public read(): any {
    const value = localStorage.getItem(this.key)

    if (value === null) {
      return null
    }

    return value
  }

  public write(data: any): void {
    localStorage.setItem(this.key, data)
  }
}
