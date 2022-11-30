require 'application_system_test_case'

class ManageCardsTest < ApplicationSystemTestCase
  test 'allows card creation and deletion' do
    visit root_path

    fill_in('Login', with: 'freddie@queen.com')
    fill_in('Password', with: 'password')
    click_button('Login')

    assert_selector('h1', text: 'My Deck')
    assert_no_selector('ul #cards')
    assert_text("You don't have any cards yet")

    click_link('Add New Card')
    fill_in('Front Text', with: 'What is a cloud? TYPO')
    click_button('Next')

    assert_selector('label', text: 'Back Text')
    go_back

    fill_in('Front Text', with: 'What is a cloud?')
    click_button('Next')

    fill_in('Back Text', with: 'Water vapour in the sky')
    click_button('Create')

    assert_selector('#cards li', text: 'What is a cloud?')
    click_link('Add New Card')

    fill_in('Front Text', with: 'What is a hedgehog?')
    click_button('Next')

    fill_in('Back Text', with: 'Spiky rodent that lives in hedges')
    click_button('Create')

    within('#cards') do
      assert_selector('li', text: 'What is a cloud?')
      assert_selector('li', text: 'What is a hedgehog?')

      find(:xpath, './li[2]').click_button('Delete')

      assert_no_selector('li', text: 'What is a hedgehog?')
    end
  end

  test 'prevents creation of empty cards' do
    visit root_path

    fill_in('Login', with: 'freddie@queen.com')
    fill_in('Password', with: 'password')
    click_button('Login')

    click_link('Add New Card')

    assert_selector('label', text: 'Front Text')

    click_button('Next')

    assert_selector('label', text: 'Front Text')
  end

  test 'sanitizes dangerous input' do
    visit root_path

    fill_in('Login', with: 'freddie@queen.com')
    fill_in('Password', with: 'password')
    click_button('Login')

    click_link('Add New Card')

    fill_in('Front Text', with: "Hello <script>alert('hacked in script tag');</script>")
    click_button('Next')

    fill_in('Back Text', with: '<img src="" onerror="alert(\'hacked in img error\');">')
    click_button('Create')

    # Implicitly tests no alert - Selenium would throw UnexpectedAlertOpenError
  end
end
