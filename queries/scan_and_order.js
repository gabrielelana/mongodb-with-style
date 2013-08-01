// we want all the transactions from an user ordered by creation time, and we want to use an index
db.transactions.drop()
db.transactions.insert({user: 'gabriele', amount: 1, created_at: ISODate()})
db.transactions.insert({user: 'gabriele', amount: 1, created_at: ISODate()})
db.transactions.insert({user: 'gabriele', amount: 1, created_at: ISODate()})
db.transactions.insert({user: 'francesco', amount: 1, created_at: ISODate()})
db.transactions.insert({user: 'francesco', amount: 1, created_at: ISODate()})
db.transactions.insert({user: 'giorgio', amount: 1, created_at: ISODate()})

// try with two indexes
db.transactions.ensureIndex({user: 1})
db.transactions.ensureIndex({created_at: 1})

result = db.transactions.find({user: 'gabriele'}).sort({created_at: 1}).explain()

print('With two separate indexes')
assert(/^BtreeCursor/.test(result.cursor), 'it uses an index to get back results')
assert(result.scanAndOrder, 'but sort is done in memory')


// we must use a compound index
db.transactions.dropIndexes()
db.transactions.ensureIndex({user: 1, created_at: 1})

result = db.transactions.find({user: 'gabriele'}).sort({created_at: 1}).explain()

print('With one compound index')
assert(/^BtreeCursor/.test(result.cursor), 'it uses an index to get back results')
assert(!result.scanAndOrder, 'sort is done in memory yay!')


// the 'query sort order' and the 'index sort order' do not matter
result = db.transactions.find({user: 'gabriele'}).sort({created_at: -1}).explain()

print('With one compound index in reverse order')
assert(/reverse$/.test(result.cursor), 'it uses the index in reverse order')
assert(!result.scanAndOrder, 'sort is done in memory yay!')

// if you only need to count then you can select only fields in index
db.transactions.dropIndexes()
db.transactions.ensureIndex({user: 1, created_at: 1})
result = db.transactions.find({user: 'gabriele'}, {user: 1, _id: 0}).sort({created_at: -1}).explain()

print('Only compund index to do everything')
assert.eq(0, result.nscannedObjects, 'no need to load found objects in memory')
assert(!result.scanAndOrder, 'sort is done in memory yay!')
assert(result.indexOnly, 'all done with the index!')
