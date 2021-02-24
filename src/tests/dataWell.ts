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

  evenMoreDocs() {
    const docs = this.multipleDocs()
    docs.push(
      {
        stringAttr: "String-1",
        numberAttr: 55,
        boolAttr: true,
        nullAttr: null,
        anotherString: "bad",
      },
      {
        stringAttr: "String-2",
        numberAttr: 44,
        boolAttr: false,
        nullAttr: null,
        anotherString: "bad",
      },
      {
        stringAttr: "String-3",
        numberAttr: 88,
        boolAttr: true,
        nullAttr: null,
        anotherString: "unknown",
      }
    )
    return docs
  }
}

export default new DataWell()
