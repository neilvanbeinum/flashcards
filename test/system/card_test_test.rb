require 'application_system_test_case'

class CardTestTest < ApplicationSystemTestCase
  test 'cannot start test if no cards have been made' do
    visit root_path

    fill_in('Login', with: 'freddie@queen.com')
    fill_in('Password', with: 'password')
    click_button('Login')

    find_button('Start Test', disabled: true)
  end

  test 'presents a test with all cards' do
    visit root_path

    fill_in('Login', with: 'brian@queen.com')
    fill_in('Password', with: 'password')
    click_button('Login')

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
