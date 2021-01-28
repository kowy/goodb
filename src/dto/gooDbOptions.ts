export interface GooDbOptions {
  /**
   * Where database files are stored
   */
  root?: string
}

export interface ModificationOperationOptions {
  /**
   * If consistent is set, gooDb waits until delete operation is synced to persistent storage also
   */
  consistent?: boolean
}
