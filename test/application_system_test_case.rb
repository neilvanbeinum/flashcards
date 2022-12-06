require 'test_helper'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  browser = ENV['SYSTEM_TEST_DRIVER']&.to_sym || :headless_chrome

  driven_by :selenium, using: browser, screen_size: [1400, 1400]

  def login_as(email:, password:)
    fill_in('Login', with: email)
    fill_in('Password', with: password)
    click_button('Login')
  end
end
