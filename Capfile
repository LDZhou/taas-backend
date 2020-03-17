# Load DSL and Setup Up Stages
require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/env'
require 'capistrano/scm/git'
install_plugin Capistrano::SCM::Git

#require 'capistrano/rails'
require 'capistrano/bundler'
require 'capistrano/rails/migrations'
require 'capistrano/rvm'
require 'capistrano/puma'
require 'capistrano/puma/nginx'
require 'capistrano/rails/logs'
#require 'capistrano/sidekiq/monit' #to require monit tasks # Only for capistrano3
install_plugin Capistrano::Puma

# Loads custom tasks from `lib/capistrano/tasks' if you have any defined.
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }

