source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.2"

gem 'dotenv-rails', groups: [:development, :test]
gem "aws-sdk-s3", require: false
gem "faraday", "~> 2.7"
gem "importmap-rails", "~> 1.1"
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "rails", "~> 7.0.4"
gem "rake_text"
gem "rodauth-rails", "~> 1.6"
gem "sass-rails", "~> 6.0"
gem "sprockets-rails"
gem "turbo-rails"
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "webdrivers"
  gem "webmock"
  gem "minitest-stub-const"
end
