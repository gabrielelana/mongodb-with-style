load('../lib/moment.js')
load('../lib/lodash.js')

// in the last 5 days
days = _(0).range(5).map(function(daysAgo) {
  return moment().subtract('days', daysAgo).format('YYYYMMDD')
})

// a random url
url = db.visits.find().skip(_.random(0, db.visits.count())).limit(1).next().digest

// what is the duration average of the visits?

ids = days.map(function(day) {return [url, day].join('-')})

duration = db.visits.aggregate([
  {$match: {_id: {$in: ids.valueOf()}}},
  {$project: {_id: 0, url: 1, hits: 1, duration: 1}},
  {$group: {_id: "$url", hits: {$sum: "$hits"}, duration: {$sum: "$duration"}}},
  {$project: {_id: 0, url: "$_id", average_duration: {$divide: ["$duration", "$hits"]}}}
])

printjson(duration)
