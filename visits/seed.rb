require "mongo"
require "faker"
require "digest"
require "active_support/all"

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")

db["visits"].drop

urls = 500.times.map{ Digest::MD5.hexdigest(Faker::Internet.url) }

30.times do |n|
  today = n.days.ago
  puts "Generate vists for #{today.strftime("%F")}"
  duration = Random.new
  formats = [ 
    ['year', today.strftime("%Y")],
    ['month', today.strftime("%Y%m")],
    ['week', today.strftime("%Yw%U")],
    ['day', today.strftime("%Y%m%d")]
  ]
  1_000.times do
    url = urls.sample     
    formats.each do |at|
      db["visits"].update(
        {:_id => [url, at].flatten.join('-'), :url => url},
        {:$inc => {:hits => 1, :duration => duration.rand(1..60)}},
        :upsert => true
      )
    end
  end
end
