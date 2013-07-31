require "mongo"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

searching_for = ["Gabriele", "Giordano"]

puts "dumb way"
puts searching_for.map{|name| db["users"].find_one(:name => name)}
puts 

puts "not so dumb way"
puts db["users"].find({:$or => searching_for.map {|name| {:name => name}}}).entries
puts 

puts "smart way"
puts db["users"].find({:name => {:$in => searching_for}}).entries
puts 
