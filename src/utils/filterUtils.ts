import isEqual from "lodash/isEqual"
import { Selector, SelectorObject } from "../dto/filter"
import StringUtils from "./stringUtils"

export function greaterThanFilter(doc: any, attrName: string, condition: Selector): boolean {
  if (typeof doc[attrName] === "string" && typeof condition.$gt === "string") {
    return StringUtils.localCompare(doc[attrName], condition.$gt) > 0
  } else {
    const a = +doc[attrName],
      b = +(condition.$gt ?? 0)
    return a > b
  }
}

export function greaterThanOrEqualFilter(doc: any, attrName: string, condition: Selector): boolean {
  if (typeof doc[attrName] === "string" && typeof condition.$gte === "string") {
    return StringUtils.localCompare(doc[attrName], condition.$gte) >= 0
  } else {
    const a = +doc[attrName],
      b = +(condition.$gte ?? 0)
    return a >= b
  }
}

export function lessThanFilter(doc: any, attrName: string, condition: Selector): boolean {
  if (typeof doc[attrName] === "string" && typeof condition.$lt === "string") {
    return StringUtils.localCompare(doc[attrName], condition.$lt) < 0
  } else {
    const a = +doc[attrName],
      b = +(condition.$lt ?? 0)
    return a < b
  }
}

export function lessThanOrEqualFilter(doc: any, attrName: string, condition: Selector): boolean {
  if (typeof doc[attrName] === "string" && typeof condition.$lte === "string") {
    return StringUtils.localCompare(doc[attrName], condition.$lte) <= 0
  } else {
    const a = +doc[attrName],
      b = +(condition.$lte ?? 0)
    return a <= b
  }
}

export function inFilter(doc: any, attrName: string, condition: SelectorObject): boolean {
  return condition.$in?.some((possibleValue: any) => isEqual(doc[attrName], possibleValue)) ?? false
}

export function ninFilter(doc: any, attrName: string, condition: SelectorObject): boolean {
  return condition.$nin?.every((possibleValue: any) => !isEqual(doc[attrName], possibleValue)) ?? false
}
