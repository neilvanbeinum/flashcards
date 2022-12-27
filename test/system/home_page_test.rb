# frozen_string_literal: true

require 'application_system_test_case'

class HomePageTest < ApplicationSystemTestCase
  test 'can view blurb and visit log in page' do
    visit root_path

    assert_text 'power-up your visual memory'

    find('nav').click_link 'Log in'

    assert_field('Login')

    find('nav').click_link 'Flashcards'

    assert_text 'power-up your visual memory'
  end
end
