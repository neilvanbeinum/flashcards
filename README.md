Local development

* Ruby 3.1.2

* Run `bundle install`

* Copy `.env` to `.env.development.local` and add real values as below.

* External services used for image generation and storage are Open AI and AWS S3
  * Sign up for an account with [Open AI](https://beta.openai.com/)
  * Copy the API key to `.env.development.local`
  * Create an S3 user with the required policies listed in the Rails ActiveStorage documentation
  * Copy the AWS key id and secret access key to `.env.development.local`

* Database commands for setup
  * `bin/rails db:setup`

* Tests
  * `bin/rails test:all`

* Background jobs
  * Currently using the Rails default (async in-memory)
