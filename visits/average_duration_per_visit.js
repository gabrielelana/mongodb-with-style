// days we are interested in
days = ['20130720', '20130721', '20130722', '20130711']

// url we are interested in
url = db.visits.findOne().url

// generate the ids of the documents we are interesed in
ids = days.map(function(day) {return [url, 'day', day].join('-')})

// average the duration of the visits of the url in given days
duration = db.visits.aggregate([
  {$match: {_id: {$in: ids}}},
  {$project: {_id: 0, url: 1, hits: 1, duration: 1}},
  {$group: {_id: "$url", hits: {$sum: "$hits"}, duration: {$sum: "$duration"}}},
  {$project: {_id: 0, average_duration: {$divide: ["$duration", "$hits"]}}}
])

printjson(duration)
