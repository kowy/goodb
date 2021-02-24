import { AscOrDesc, ComparatorFunction, SortRequest } from "../dto/filter"
import equal from "fast-deep-equal"

export default class SortUtils {
  static sort(docs: any[], sorter: SortRequest): any[] {
    const functions = this.createSortArray(docs, sorter)
    const comparator = (a: any, b: any) => {
      for (let i = 0; i < functions.length; i++) {
        const comparisonResult = functions[i](a, b)
        if (comparisonResult !== 0) return comparisonResult
      }

      return 0
    }

    return docs.sort(comparator)
  }

  private static createSortArray(docs: any[], sorter: SortRequest): ComparatorFunction[] {
    if (typeof sorter === "function") {
      return [sorter]
    } else if (typeof sorter === "string") {
      return [this.createSortComparator(docs, sorter, "asc")]
    } else {
      // sorter is one ComparatorObject
      return Object.keys(sorter).map((it) => this.createSortComparator(docs, it, sorter[it]))
    }
  }

  private static createSortComparator(docs: any[], sortAttr: string, sortDirection: AscOrDesc): ComparatorFunction {
    let result: ComparatorFunction

    if (sortDirection === "desc") {
      if (typeof docs[0][sortAttr] === "number") {
        result = (a: any, b: any) => b[sortAttr] - a[sortAttr]
      } else if (typeof docs[0][sortAttr] === "boolean") {
        result = (a: any, b: any) => {
          if (a[sortAttr]) {
            if (b[sortAttr]) return 0
            return 1
          }

          if (b[sortAttr]) return -1
          return 0
        }
      } else if (typeof docs[0][sortAttr] === "string") {
        result = (a: any, b: any): number => {
          const aValue: string = a[sortAttr]
          const bValue: string = b[sortAttr]
          return bValue.localeCompare(aValue)
        }
      } else {
        result = (a: any, b: any): number => {
          if (equal(a[sortAttr], b[sortAttr])) return 0
          else if (a[sortAttr] > b[sortAttr]) return -1
          else return 1
        }
      }
    } else {
      if (typeof docs[0][sortAttr] === "number") {
        result = (a: any, b: any): number => a[sortAttr] - b[sortAttr]
      } else if (typeof docs[0][sortAttr] === "boolean") {
        result = (a: any, b: any): number => {
          if (a[sortAttr]) {
            if (b[sortAttr]) return 0
            return -1
          }

          if (b[sortAttr]) return 1
          return 0
        }
      } else if (typeof docs[0][sortAttr] === "string") {
        result = (a: any, b: any): number => {
          const aValue: string = a[sortAttr]
          const bValue: string = b[sortAttr]
          return aValue.localeCompare(bValue)
        }
      } else {
        result = (a: any, b: any): number => {
          if (equal(a[sortAttr], b[sortAttr])) return 0
          else if (a[sortAttr] > b[sortAttr]) return 1
          else return -1
        }
      }
    }

    return result
  }
}
