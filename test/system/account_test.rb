# frozen_string_literal: true

require 'application_system_test_case'

class AccountTest < ApplicationSystemTestCase
  test 'visiting the deck path when logged out redirects to the home page' do
    visit deck_path

    assert_field('Login')
    assert_no_text 'My Deck'
  end

  test 'can log out' do
    visit '/login'

    assert_no_link 'Log out'

    login_as(email: 'freddie@queen.com', password: 'password')

    click_link 'Log out'

    assert_text 'power-up your visual memory'
  end

  test 'clicking the home nav link returns me to my deck when logged in' do
    visit '/login'

    login_as(email: 'freddie@queen.com', password: 'password')

    click_link 'Flashcards'

    assert_text 'My Deck'
  end
end
