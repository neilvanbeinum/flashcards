# frozen_string_literal: true

require 'application_system_test_case'

class CardTestTest < ApplicationSystemTestCase
  test 'cannot start test if no cards have been made' do
    visit root_path

    login_as(email: 'freddie@queen.com', password: 'password')

    find_button('Start Test', disabled: true)
  end

  test 'presents a test with all cards' do
    visit root_path

    login_as(email: 'brian@queen.com', password: 'password')

    click_button('Start Test')

    find('div#test-container').assert_text('front_text_one')
    click_button('Flip Card')

    find('div#test-container').assert_text('back_text_one')
    click_button('Flip Card')

    find('div#test-container').assert_text('front_text_one')
    click_button('Next Card')

    find('div#test-container').assert_text('front_text_two')
    click_button('Flip Card')

    find('div#test-container').assert_text('back_text_two')
    click_button('End Test')

    assert_selector('h1', text: 'My Deck')
  end
end
