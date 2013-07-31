BASE_DIRECTORY = File.expand_path(File.dirname(__FILE__))

BIN_DIRECTORY = File.join(BASE_DIRECTORY, ".bin")
DATA_DIRECTORY = File.join(BASE_DIRECTORY, ".data")
LOG_DIRECTORY = File.join(BASE_DIRECTORY, ".log")

DB_NAME = "mongodb-with-style"
DB_DIRECTORY = File.join(DATA_DIRECTORY, DB_NAME)
DB_LOG = File.join(LOG_DIRECTORY, DB_NAME)
DB_PORT = 30001

verbose(false)

task :start => [:clean, :prepare] do
  mkdir_p DB_DIRECTORY
  sh "#{BIN_DIRECTORY}/mongod " \
    "--dbpath #{DB_DIRECTORY} " \
    "--logpath #{DB_LOG} " \
    "--logappend --fork --noprealloc --smallfiles --quiet " \
    "--port #{DB_PORT}"
end

task :stop do
  if started?
    sh "#{BIN_DIRECTORY}/mongo --quiet --port #{DB_PORT} " \
      "--eval \"db.getSiblingDB('admin').shutdownServer()\" " \
      "> /dev/null 2>&1"
  end
end

task :run, [:script] => [:up] do |task, args|
  initialize = script = ''
  script = args.script if not args.script.nil? and File.exists?(args.script)
  initialize = "--eval 'chatty(cd(\"#{File.dirname(script)}\"))'" unless script.empty?
  sh "#{BIN_DIRECTORY}/mongo --quiet 127.0.0.1:#{DB_PORT}/#{DB_NAME} #{initialize} #{script}"
end

task :shell => [:up] do |task, args|
  sh "#{BIN_DIRECTORY}/mongo --quiet --shell 127.0.0.1:#{DB_PORT}/#{DB_NAME}"
end

task :seed => [:up] do
  Dir['*/seed.json'].each do |seed|
    puts "import #{seed}"
    sh "#{BIN_DIRECTORY}/mongoimport --port=#{DB_PORT} --db=#{DB_NAME} --drop --collection=#{File.dirname(seed)} --file=#{seed}"
  end
end

task :restart => [:stop, :start]

task :up => [:prepare] do
  Rake::Task["start"].invoke unless started?
end

task :prepare do
  raise '.bin directory must contain MongoDB executables' unless Dir.exists?(BIN_DIRECTORY)
  mkdir_p [DATA_DIRECTORY, LOG_DIRECTORY]
end

task :clean => [:stop] do
  sleep 0.250
  rm_rf [DATA_DIRECTORY, LOG_DIRECTORY]
end

def started?
  sh "#{BIN_DIRECTORY}/mongo --quiet --port #{DB_PORT} --eval \"db.runCommand({ping: 1})\" > /dev/null 2>&1" do |ok, res|
    ok
  end
end
