# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.2'

gem 'aws-sdk-s3', require: false
gem 'dotenv-rails', groups: %i[development test]
gem 'faraday', '~> 2.7'
gem 'importmap-rails', '~> 1.1'
gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'
gem 'rails', '~> 7.0.4'
gem 'rake_text'
gem 'rodauth-rails', '~> 1.6'
gem 'sass-rails', '~> 6.0'
gem 'sprockets-rails'
gem 'stimulus-rails'
gem 'turbo-rails'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

group :development, :test do
  gem 'debug', platforms: %i[mri mingw x64_mingw]
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
end

group :test do
  gem 'capybara'
  gem 'minitest-stub-const'
  gem 'selenium-webdriver'
  gem 'webdrivers'
  gem 'webmock'
end
