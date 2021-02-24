# GooDB
[ɡʊd][bi:]
[![Test](https://github.com/kowy/goodb/workflows/Test/badge.svg?branch=dev)](https://github.com/kowy/goodb/actions?query=workflow:Test+branch:dev)
[![Release](https://github.com/kowy/goodb/workflows/Release/badge.svg)](https://github.com/kowy/goodb/actions?query=workflow:Release+branch:master)
[![codecov](https://codecov.io/gh/kowy/goodb/branch/master/graph/badge.svg)](https://codecov.io/gh/kowy/goodb)
## :speech_balloon: Characteristics
* pure embedded database
* pure object database (objects are serialized to JSON directly in DB)
* suitable for electron or browser applications when you would like to avoid bulky full featured databases 
* suitable for limited datasets (not more than millions of objects)
* full database is stored in-memory and persisted to storage also (filestore or browser Local Storage)
* provides both sync & async interface   
* 100% Typescript support

## :package: Installation
In project root simply run:
```
yarn add --dev goodb
```
or
```
npm install --save-dev goodb
```
or add this row to `dependencies` section in package.json and apply changes:
```json
{
    "dependencies": {
        "goodb": "^0.1.0"
    }
}
```

## :hammer: Usage
* [Create instance](#create-instance)
* [Operations](#operations)
    * [findById](#findbyid)
    * [findAll](#findall)
    * [filter](#filter)
    * [upsert](#upsert)
    * [upsertAll](#upsertall)
    * [modifyById](#modifybyid)
    * [deleteById](#deletebyid)
* [Structures](#structures)
    * [FilterObject](#filterobject)
    * [Selector](#selector)
    * [ModificationOperationOptions](#modificationoperationoptions)
    
### Create instance
To use GooDB import it and create GooDB instance:
```ts
// Typescript
import GooDb from "goodb"
const db = new GooDb("my-db", {})
```
In the working directory this will create a new subfolder `db` with file `my-db.yml`. To this file all your DB objects are persisted.
You can tune DB by an `options` parameter:
```js
{
    // [string] - you can specify different place where DB file is created
    root: "/home/user/temp/db"
}
```

### Operations
#### findById
Try to find document by its _id and return the document or `undefined`

**Parameters**
* id [string] - generated document _id. If this value is empty it will return `undefined`

**Response object**

Returns directly the found document or `undefined` if not exists

**Example**
```ts
const foundObject = db.findById(originObjects[0]._id)
```

#### findAll
Return all objects in DB in one response.

**Response object**
```js
{
    docs: [ {}, {}, {} ],
    // [int] - total number of objects in DB (in case of findAll request, returns number of returned objects) 
    totalDocs: 1
}
```

**Example**
```ts
  const result = db.findAll()
  expect(result.totalDocs).toBe(3)
  expect(result.docs.length).toBe(3)
```  

#### filter
Lookup to a database and return all objects which match provided Selector and optionally sort them by Sorter

**Parameters**

* request [[FilterObject](#FilterObject)] - an object specifying filtering, sorting and limit conditions

**Response object**
```js
{
    docs: [ {}, {}, {} ],
    // [int] - total number of objects in DB (in case of findAll request, returns number of returned objects) 
    totalDocs: 1
}
```

**Example**

Get first 99 items from database (without filtering):
```ts
  const first99Objects = db.filter({
    selector: {},
    limit: 99,
  })
```

Get all objects where `firstName` equals "Pepa"
```ts
  const foundObjects = db.filter({
    selector: { firstName: "Pepa" }
  })
```


Get all objects where `boolAttr` is `false` and sort them by `numberAttr` downwardly
```ts
  const foundObjects = db.filter({
    selector: { boolAttr: { $eq: false } },
    sort: { numberAttr: "desc" },
  })
```

Get all objects where `numberAttr` is even and sort them `numberAttr` upwardly
```ts
  const foundByFunction = db.filter({
    selector: (a: any) => a.numberAttr % 2 === 0,
    sort: "numberAttr",
  })
```

Sort by multiple attributes
```ts
  const foundByValue = db.filter({
    selector: { anotherString: "good" },
    sort: (a: any, b: any) => {
      // sort by boolAttr, then by stringValue
      if (a.boolAttr && !b.boolAttr) {
        return -1
      } else if (!a.boolAttr && b.boolAttr) {
        return 1
      } else {
        const aValue: string = a.stringAttr
        const bValue: string = b.stringAttr
        return aValue.localeCompare(bValue)
      }
    }
```
#### upsert
Insert or update a new document to the database. 

If provided document has an _id attribute set, upsert operation try to find the document with this _id and update it. If the document is missing (there is no document with this _id), a new document with provided _id is created (that means you can specify a custom document _id). 

On the other hand, if the document doesn't have an _id attribute or is empty, GooDB will generate this _id and save the document to DB.

**Parameters**
* doc [any] - your document, which should be stored in GooDB
* options [[ModificationOperationOptions](#modificationoperationoptions)] - extra settings for upsert operation. Optional parameter

**Response object**

Your upserted document with an _id attribute already filled.

**Example**   
```ts
const docId = db.upsert({ name: "Simple Object",  value: "42" })._id
```

#### upsertAll
Like [upsert](#upsert) operation, but you can update/insert multiple values at once. This operation is faster than multiple separate upserts, because they are saved to persistent storage at once.  

**Parameters**
* docs [array of any] - your documents, which should be stored in GooDB
* options [[ModificationOperationOptions](#modificationoperationoptions)] - extra settings for upsertAll operation. Optional parameter

**Response object**

An array of your upserted document with an amended _id attributes.

**Example**   
```ts
const documents = db.upsertAll([
    { name: "First Object", age: 42 },
    { name: "Second Object", age: 13, color: "white"}
])
```

#### modifyById
In this function you can modify existing document in GooDB by providing its _id and modificator function. GooDB will lookup to document by its _id and if find it, it will call modificator function on this document. Then the document returned from modificator function will be stored to DB. If document with _id is not found, modifyById will return `undefined`

You can't modify the id attribute in this function.

**Parameters**
* id [string] - and id of the document you would like to modify
* modificatorFunction `(a: any) => any` - function which get document from DB in input and return modified document in output 
* options [[ModificationOperationOptions](#modificationoperationoptions)] - extra settings for modifyById operation. Optional parameter

**Response object**

Method returns modified document

**Example**
```ts
  const modifiedDocument: any = db.modifyById(originDocs._id, (doc: any) => {
    doc.stringAttr += " modified"
    doc.numberAttr += 5
    return doc
  })
```

#### deleteById
Delete document in DB by its id

**Parameters**
* id [string] - id of the document you would like to delete
* options [[ModificationOperationOptions](#modificationoperationoptions)] - extra settings for deleteById operation. Optional parameter

**Response object**

True if document was deleted false, false if not

**Example**
```ts
db.deleteById(originDocs[0]._id)
```

### Structures
#### FilterObject
An object specifying filtering, sorting and limit conditions for [filter](#filter) method
```js
{
    // [MatcherFunction | Selector] - mandatory field restricting which objects will be returned.
    // can have several different appearances. See below for more details
    selector: {},
    // [SortRequest] - specify how resulted objects are sorted. 
    // Optional parameter (if missing, objects won't be sorted) 
    sort: {},
    // [int] - after filtering and sorting cut first "limit" objects and return. 
    // Optional parameter (if missing, all objects will be returned)
    limit: 1
}  
```
**selector** field can be in one of these variants:
* a simple object - if you use for example `{ animal: "slon" }`, it will return only objects which has attribute *animal* with value exactly equals to "slon" (case sensitive) 
* MatcherFunction - any function which accept one input object and returns true or false depending on whether the document should remain in the filter result or not. For example filter all even values:
```ts
(a: any) => a.numberAttribute % 2 === 0 
```
* [Selector](#Selector) - mongo-inspired filter with Query Operators

**sort** field can be in one of these variants:
* simple string - determine attribute name by which results will be sorted. In this variant documents are always sorted upwardly (ascending). Example:
```js
db.filter({
    selector: {},
    sort: "stringAttribute"
})
```
* object - a simple object, where you can set any number of attributes with specified order direction. Filtered documents will be sorted by these attributes. Order direction is one of:
    * asc - results are sorted upwardly (ascending)
    * desc - results are sorted downwardly (descending)
  
  In succeeding example document will be sortedy by *stringAttribute* downwardly and documents with same *stringAttribute* then will be sorted by *numberAttribute* upwardly. 
```js
db.filter({
    selector: {},
    sort: { stringAttribute: "desc", numberAttribute: "asc" } 
})
```    
* function - comparator function. It should take 2 parameters (documents) and return integer depending on their expected order (=0 - they are equal; <0 - first parameter is smaller than the second; >0 - first parameter is greater than the second)
```js
// sort numbers upwardly (ascending)
db.filter({
    selector: {},
    sort: (a, b) => a.numberAttr - b.numberAttr
})
```

#### Selector
You can use Operators to filter data like in [mongo](https://docs.mongodb.com/manual/reference/method/db.collection.find/#query-using-operators)

Currently, only these operators are implemented:
* [$eq](https://docs.mongodb.com/manual/reference/operator/query/eq/#op._S_eq) - matches if document field equals this value
* [$ne](https://docs.mongodb.com/manual/reference/operator/query/ne/#op._S_ne) - matches if document field does not equal value
* [$gt](https://docs.mongodb.com/manual/reference/operator/query/gt/#op._S_gt) - matches if document field is greater than value (can be used for numbers and strings)
* [$gte](https://docs.mongodb.com/manual/reference/operator/query/gte/#op._S_gte) - matches if document field is greater than or equal to value (can be used for numbers and strings)
* [$lt](https://docs.mongodb.com/manual/reference/operator/query/lt/#op._S_lt) - matches if document field is less than value (can be used for numbers and strings)
* [$lte](https://docs.mongodb.com/manual/reference/operator/query/lte/#op._S_lte) - matches if document field is less than or equal to value (can be used for numbers and strings)
* [$in](https://docs.mongodb.com/manual/reference/operator/query/in/#op._S_in) - matches if document field equals to any value in the array specified in $in element
* [$nin](https://docs.mongodb.com/manual/reference/operator/query/nin/#op._S_nin) - not IN operator. Matches if document field DOES NOT equal to any value in the array specified in $nin element

#### ModificationOperationOptions
Structure for extra settings for altering operations (upsert, upsertAll, modifyById, deleteById...)
```js
{
    consistent: false
}
```

* consistent [boolean] - if set to true, operation will wait until the data are written to a persistent storage also 

## :heart: Big Thanks to 
* [lowdb](https://github.com/typicode/lowdb) - super simple and versatile JSON DB engine which strongly inspired me
* [PouchDb](https://pouchdb.com) - another super embedded JS DB, but do not provide sync interface
* [typescript-library-boilerplate](https://github.com/VitorLuizC/typescript-library-boilerplate) - this project is cooked from this boilerplate

## :seedling: Currently used by
* [Zatopek](https://bitbucket.org/zatopekteam/zatopek) - Result tables for running and athletics

## :book: License
Released under [MIT License](./LICENSE).
