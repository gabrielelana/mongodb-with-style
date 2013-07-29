require "mongo"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

searching_for = ["Gabriele", "Giordano"]

puts searching_for.map{|name| db["users"].find_one(:name => name)}
