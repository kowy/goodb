import { FilterResponse, isMatcherFunction, isSelectorObject, MatcherFunction, Selector, SelectorObject } from "../dto/filter"
import isEqual from "lodash/isEqual"
import * as f from "./filterUtils"

export default class DatabaseUtils {
  public static addStatistics(result: FilterResponse<any>): FilterResponse<any> {
    result.offset = 0
    result.pageSize = 0 // this means all items
    result.totalDocs = result.docs.length
    return result
  }

  public static getFilterFunctions(selector: MatcherFunction | Selector): ((doc: any) => boolean)[] {
    // first check whether doc is object. If not, no other checks has reason
    let result = [
      (doc: any) => {
        return typeof doc === "object"
      },
    ]

    if (isMatcherFunction(selector)) {
      result.push(selector)
    } else {
      Object.keys(selector)
        .map((attrName) => {
          const attrValue = selector[attrName]
          // if (typeof attrValue === "function") {
          //   const attrFunction: (a: any) => boolean = attrValue
          //   return [(doc: any) => attrFunction(doc[attrName])]
          // }
          if (isSelectorObject(attrValue)) {
            return this.filterBySelectorObject(attrName, attrValue)
          }
          return [
            (doc: any) => {
              return isEqual(doc[attrName], attrValue)
            },
          ]
        })
        .forEach((func) => {
          result = result.concat(func)
        })
    }

    return result
  }

  /**
   * Go through all filterFunctions, apply them to provided document. If all of provided filterFunctions result to TRUE,
   * return TRUE. Otherwise return FALSE
   * @param doc
   * @param filterFunctions
   */
  public static applyFilters(doc: any, filterFunctions: ((doc: any) => boolean)[]): boolean {
    return filterFunctions.map((func) => func(doc)).reduce((acc, filterResult) => acc && filterResult)
  }

  private static filterBySelectorObject(attrName: string, condition: SelectorObject): ((doc: any) => boolean)[] {
    const result = []
    if (typeof condition.$eq !== "undefined") {
      result.push((doc: any) => isEqual(doc[attrName], condition.$eq))
    }
    if (typeof condition.$ne !== "undefined") {
      result.push((doc: any) => !isEqual(doc[attrName], condition.$ne))
    }
    if (typeof condition.$gt !== "undefined") {
      result.push((doc: any) => f.greaterThanFilter(doc, attrName, condition))
    }
    if (typeof condition.$gte !== "undefined") {
      result.push((doc: any) => f.greaterThanOrEqualFilter(doc, attrName, condition))
    }
    if (typeof condition.$lt !== "undefined") {
      result.push((doc: any) => f.lessThanFilter(doc, attrName, condition))
    }
    if (typeof condition.$lte !== "undefined") {
      result.push((doc: any) => f.lessThanOrEqualFilter(doc, attrName, condition))
    }
    if (typeof condition.$in !== "undefined" && Array.isArray(condition.$in)) {
      result.push((doc: any) => f.inFilter(doc, attrName, condition))
    }
    if (typeof condition.$nin !== "undefined" && Array.isArray(condition.$nin)) {
      result.push((doc: any) => f.ninFilter(doc, attrName, condition))
    }

    if (result.length == 0) {
      console.log(`Unknown condition ${JSON.stringify(condition)} for attribute ${attrName}`)
    }

    return result
  }
}
