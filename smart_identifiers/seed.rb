require "mongo"
require "faker"
require "digest"
require "active_support/all"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

db["visits"].drop

urls = 1_000.times.map{ Digest::MD5.hexdigest(Faker::Internet.url) }

30.times do |n|
  today = n.days.ago
  puts "Generate vists for #{today.strftime("%F")}"
  formats = [ 
    today.strftime("%Y"),
    today.strftime("%Y%m"),
    today.strftime("%Yw%U"),
    today.strftime("%Y%m%d")
  ]
  1_000.times do
    url = urls.sample     
    formats.each do |at|
      db["visits"].update(
        {:_id => [url, at].join('-'), :url => url},
        {:$inc => {:hits => 1}},
        :upsert => true
      )
    end
  end
end
