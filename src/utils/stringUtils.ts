export default class StringUtils {
  static comparator = new Intl.Collator()

  public static localCompare(a: string, b: string): number {
    return this.comparator.compare(a, b)
  }
}
