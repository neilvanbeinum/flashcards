# Pin npm packages by running ./bin/importmap

pin 'application', preload: true
pin_all_from File.expand_path('../app/javascript', __dir__)
pin '@hotwired/turbo-rails', to: 'turbo.min.js', preload: true
