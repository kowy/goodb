class DataWell {
  simpleDoc() {
    return {
      stringAttr: "String Attribute with diacritics ěščřžýáíé",
      numberAttr: 935,
      boolAttr: false,
      nullAttr: null,
    }
  }

  multipleDocs() {
    return [
      {
        stringAttr: "String3",
        numberAttr: 11,
        boolAttr: false,
        nullAttr: null,
        anotherString: "good",
      },
      {
        stringAttr: "String2",
        numberAttr: 22,
        boolAttr: true,
        nullAttr: null,
        anotherString: "good",
      },
      {
        stringAttr: "String1",
        numberAttr: 33,
        boolAttr: false,
        nullAttr: "null",
        anotherString: "good",
      },
    ]
  }

  compareArrays(arr1: Array<any>, arr2: Array<any>) {
    arr1.forEach((a1item) => {
      arr2
        .filter((a2item) => (a1item.numberValue = a2item.numberValue))
        .forEach((a2item) => expect(a1item).toMatchObject(a2item.numberValue))
    })
  }
}

export default new DataWell()
