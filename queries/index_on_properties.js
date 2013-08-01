load('../lib/faker.js')
load('../lib/faker.name.js')
load('../lib/lodash.js')

Random.setRandomSeed()

db.products.drop()
_(500).times(function() {
  db.products.insert({
    price: (Random.randInt(250) + 50),
    title: Faker.Name.product(),
    properties: [
      {seek_time: (Random.randInt(25) + 5) + 'ms'},
      {rotation_speed: (Random.randInt(10) + 10) + 'k RPM'},
      {transfer_rate: (Random.randInt(10) + 5) + 'Gb/s'}
    ]
  })
})

db.products.ensureIndex({properties: 1})

result = db.products.find({properties: {seek_time: '5ms'}}).explain()

assert(result.isMultiKey, 'index multiple elements per document')
assert(/^BtreeCursor/.test(result.cursor), 'index is used')
