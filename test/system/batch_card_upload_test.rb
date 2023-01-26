# frozen_string_literal: true

require 'application_system_test_case'

class BatchCardUploadTest < ApplicationSystemTestCase
  test 'can upload a CSV file to create multiple cards' do
    visit '/login'

    login_as(email: 'freddie@queen.com', password: 'password')

    click_link 'Create Multiple Cards'

    assert_text 'Upload a CSV'

    Tempfile.create do |file|
      attach_file('CSV File', file.path)

      click_button 'Create Cards'
    end

    assert_text 'Upload a CSV'
    assert_equal 1, all('.errors li').length

    within('.errors') do
      assert_text 'Empty file'
    end

    Tempfile.create do |file|
      file.write 'How many planets are in the solar system?, '
      file.rewind

      attach_file('CSV File', file.path)
      click_button 'Create Cards'
    end

    assert_text 'Upload a CSV'
    assert_equal 1, all('.errors li').length

    within('.errors') do
      assert_text 'File contains one or more invalid rows'
    end

    Tempfile.create do |file|
      file.write <<~CSV
        How many planets are in the solar system?, 7
        What does TV stand for?, Television
      CSV
      file.rewind

      attach_file('CSV File', file.path)
      click_button 'Create Cards'
    end

    assert_text 'My Deck'

    within('.alert') do
      assert_text '2 cards created'
    end

    within('#cards') do
      within(:xpath, './li[1]') do
        assert_text('How many planets are in the solar system?')
      end

      within(:xpath, './li[2]') do
        assert_text('What does TV stand for?')
      end
    end
  end
end
