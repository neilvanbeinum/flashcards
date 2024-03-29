# frozen_string_literal: true

require 'application_system_test_case'

class CardTestTest < ApplicationSystemTestCase
  test 'cannot start test if no cards have been made' do
    visit '/login'

    login_as(email: 'freddie@queen.com', password: 'password')

    assert_no_link('Start Test')
  end

  test 'presents a test with all cards' do
    visit '/login'

    login_as(email: 'brian@queen.com', password: 'password')

    click_link('Start Test')

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

  test 'can end a single-card test' do
    card_one = cards(:card_one)
    Card.where.not(id: card_one.id).destroy_all

    visit '/login'

    login_as(email: 'brian@queen.com', password: 'password')

    click_link('Start Test')

    find('div#test-container').assert_text('front_text_one')
    click_button('End Test')

    assert_selector('h1', text: 'My Deck')
  end
end
