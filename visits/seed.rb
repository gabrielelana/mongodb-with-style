require "mongo"
require "faker"
require "digest"
require "active_support/all"

chaos = Random.new
urls = 250.times.map {Faker::Internet.url}

db = Mongo::MongoClient.new("localhost", 30001).db("mongodb-with-style")
db["visits"].drop

10.times do |n|
  today = n.days.ago
  puts "Generate vists for #{today.strftime("%F")}"

  chaos.rand(200..1000).times do
    visited_url = urls.sample
    visites_url_digest = Digest::MD5.hexdigest(visited_url)
    today_formatted = today.strftime("%Y%m%d")
    db["visits"].update(
      {:_id => [visites_url_digest, today_formatted].join("-"), :url => visited_url, :digest => visites_url_digest, :at => today_formatted},
      {:$inc => {:hits => 1, :duration => chaos.rand(1..60)}},
      :upsert => true
    )
  end
end
