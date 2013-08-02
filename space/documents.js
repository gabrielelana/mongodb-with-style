// when you need to store a *lot* of documents, even a single byte count

// the smallest document
assert.eq(5, Object.bsonsize({}))

// short names for fields counts
assert.eq(8, Object.bsonsize({v:null}))
assert.eq(9, Object.bsonsize({vv:null}))
assert.eq(10, Object.bsonsize({vvv:null}))
assert.eq(11, Object.bsonsize({vvvv:null}))

// 3 additional bytes per field
assert.eq(8, Object.bsonsize({v:null}))
assert.eq(11, Object.bsonsize({v:null, f:null}))
assert.eq(14, Object.bsonsize({v:null, f:null, s:null}))

// 12 bytes for an ObjectId but it's necessary
assert.eq(20, Object.bsonsize({v:ObjectId()}))

// if you know your data you can save some bytes
assert.eq(16, Object.bsonsize({v:1})) // 64 bit double
assert.eq(16, Object.bsonsize({v:NumberLong(1)})) // 64 bit integer
assert.eq(12, Object.bsonsize({v:NumberInt(1)})) // 32 bit integer
