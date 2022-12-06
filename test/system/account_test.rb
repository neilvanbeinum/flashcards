require 'application_system_test_case'

class CardTestTest < ApplicationSystemTestCase
  test "can log out" do
    visit root_path

    assert_no_link "Log out"

    fill_in('Login', with: 'freddie@queen.com')
    fill_in('Password', with: 'password')
    click_button('Login')

    click_link "Log out"

    assert_field("Login")

    visit deck_path

    assert_field("Login")
    assert_no_text "My Deck"
  end
end
