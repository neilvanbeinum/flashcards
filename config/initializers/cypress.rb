return unless Rails.env.test?

Rails.application.load_tasks unless defined?(Rake::Task)

CypressRails.hooks.before_server_start do
  Rake::Task["db:fixtures:load"].invoke
end

CypressRails.hooks.before_server_stop do
  # Purge and reload the test database so we don't leave our fixtures in there
  Rake::Task["db:test:prepare"].invoke
end
