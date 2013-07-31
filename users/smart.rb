require "mongo"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

searching_for = ["Gabriele", "Giordano"]

puts db["users"].find({:name => {:$in => searching_for}}).entries
