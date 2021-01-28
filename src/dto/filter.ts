export type ComparatorFunction = (a: any, b: any) => number
export type SortRequest = string | { [propName: string]: "asc" | "desc" } | ComparatorFunction

export interface SelectorObject {
  /** Matches if field equals this value */
  $eq?: any
  /** Matches if field does not equal value */
  $ne?: any
  /** Matches if field is greater than value (can be used for numbers and strings) */
  $gt?: number | string
  /** Matches if field is greater than or equal to value (can be used for numbers and strings) */
  $gte?: number | string
  /** Matches if field is less than value (can be used for numbers and strings) */
  $lt?: number | string
  /** Matches if field is less than or equal to value (can be used for numbers and strings) */
  $lte?: number | string
  /** Matches if field equals to any value in the array specified in $in element */
  $in?: any[]
  /** Not IN operator. Matches if field DOES NOT equal to any value in the array specified in $nin element.  */
  $nin?: any[]
}

export interface Selector {
  [field: string]: SelectorObject | any
}

export type MatcherFunction = (a: any) => boolean

export interface FilterRequest {
  /** Defines a selector to filter the results. Required */
  selector: MatcherFunction | Selector

  /** Defines the order of resulting documents. It may be specified via
   *  * function - comparator function with 2 parameters returning -1 if first parameter is LESS then second, +1 if first parameter is GREATER then second or 0 if they are equal
   *  * column name amended with optional direction (asc | desc)
   */
  sort?: SortRequest

  /**
   * Maximum number of docs to be selected
   */
  limit?: number
}

export interface FilterResponse<Content extends Record<string, unknown>> {
  docs: Array<Content>
  offset?: number
  pageSize?: number
  totalDocs?: number
}

/**
 * Value is expected to be the Selector if all its attributes start with $ character
 */
export function isSelectorObject(value: SelectorObject): value is SelectorObject {
  if (value === null) return false
  return Object.keys(value).every((it) => ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$in", "$nin"].includes(it))
}

export function isMatcherFunction(value: MatcherFunction | Selector): value is MatcherFunction {
  return typeof value === "function"
}
