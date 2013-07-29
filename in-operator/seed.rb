require "mongo"
require "faker"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

jobs = ["Carpenter", "Journalist", "Farmer", "Artist", "Educator", "Dancer", "Lawyer", "Librarian", "Writer", "Zoologist"]

db["users"].drop
db["users"].insert(
  1000.times.map {
    {:name => Faker::Name.first_name, :surname => Faker::Name.last_name, :job => jobs.sample}
  }
)

db["users"].insert([
  {:name => "Gabriele", :surname => "Lana", :job => "softwarecraftsman"},
  {:name => "Federico", :surname => "Galassi", :job => "softwarecraftsman"},
  {:name => "Giordano", :surname => "Scalzo", :job => "softwarecraftsman"}
])

db["users"].create_index({:name => Mongo::ASCENDING})
