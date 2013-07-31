// days we are interested in
days = ['20130720', '20130721', '20130722']

// url we are interested in
url = db.visits.findOne().url

// generate the ids of the documents we are interesed in
ids = days.map(function(day) {return [url, 'day', day].join('-')})

// sum all the hits on the url in given days
hits = db.visits.aggregate([
  {$match: {_id: {$in: ids}}},
  {$project: {_id: 0, url: 1, hits: 1}},
  {$group: {_id: "$url", hits: {$sum: "$hits"}}} 
])

printjson(hits)
