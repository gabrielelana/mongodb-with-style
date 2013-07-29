require "mongo"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

puts db["users"].find({:$or => [{:name => "Gabriele"}, {:name => "Giordano"}]}).entries
