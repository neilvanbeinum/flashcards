# frozen_string_literal: true

require 'application_system_test_case'

class ManageCardsTest < ApplicationSystemTestCase
  include ActiveJob::TestHelper

  test 'allows card creation and deletion' do
    visit root_path

    login_as(email: 'freddie@queen.com', password: 'password')

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
    assert_enqueued_jobs(1, only: SignpostJob) do
      click_button('Create')

      assert_selector('h1', text: 'My Deck')
    end

    assert_selector('#cards li', text: 'What is a cloud?')
    click_link('Add New Card')

    fill_in('Front Text', with: 'What is a hedgehog?')
    click_button('Next')

    fill_in('Back Text', with: 'Spiky rodent that lives in hedges')
    assert_enqueued_jobs(1, only: SignpostJob) do
      click_button('Create')

      assert_selector('h1', text: 'My Deck')
    end

    within('#cards') do
      within(:xpath, './li[1]') do
        assert_text('What is a cloud?')
        assert_text('Image pending')
        find_button('Delete')
      end

      within(:xpath, './li[2]') do
        assert_text('What is a hedgehog?')
        assert_text('Image pending')
        find_button('Delete')
      end
    end

    cloud_image_generation_request = stub_request(:post, ENV.fetch('IMAGE_GENERATOR_API_URL')).with(
      body: hash_including({ prompt: 'cloud water vapour sky with sunglasses' })
    ).and_return(body: { data: [{ url: 'https://example.com/cloud.jpg' }] }.to_json, status: 200)

    cloud_image_request = stub_request(:get, 'https://example.com/cloud.jpg').and_return(
      body: File.new('test/fixtures/files/cloud.jpg'), status: 200
    )

    hedgehog_image_generation_request = stub_request(:post, ENV.fetch('IMAGE_GENERATOR_API_URL')).with(
      body: hash_including({ prompt: 'hedgehog spiky rodent lives hedges with sunglasses' })
    ).and_return(body: { data: [{ url: 'https://example.com/hedgehog.jpg' }] }.to_json, status: 200)

    hedgehog_image_request = stub_request(:get, 'https://example.com/hedgehog.jpg').and_return(
      body: File.new('test/fixtures/files/hedgehog.jpg'), status: 200
    )

    ImageGeneration.stub_const(:MODIFICATION_KEYWORDS, ['with sunglasses']) do
      perform_enqueued_jobs
    end

    assert_requested(cloud_image_generation_request)
    assert_requested(cloud_image_request)

    assert_requested(hedgehog_image_generation_request)
    assert_requested(hedgehog_image_request)

    page.refresh

    within('#cards') do
      within(:xpath, './li[1]') do
        assert_text('Image success')
      end

      within(:xpath, './li[2]') do
        assert_text('Image success')
      end
    end

    within('#cards') do
      find(:xpath, './li[2]').click_button('Delete')

      assert_no_selector('li', text: 'What is a hedgehog?')
    end

    click_button 'Start Test'

    find('#test-container').assert_text 'What is a cloud?'

    click_button('Flip Card')

    within('#test-container') do
      assert_css('img[src$="cloud.jpg"]')
    end
  end

  test 'allows manual image fetch after a failure' do
    visit root_path

    login_as(email: 'freddie@queen.com', password: 'password')

    click_link('Add New Card')
    fill_in('Front Text', with: 'What is a cloud?')

    click_button('Next')

    fill_in('Back Text', with: 'Water vapour in the sky')

    stubbed_response = stub_request(:post, ENV.fetch('IMAGE_GENERATOR_API_URL')).with(
      body: hash_including(
        {
          prompt: 'cloud water vapour sky with sunglasses'
        }
      )
    ).and_return(
      body: { error: 'Something is up' }.to_json,
      status: 200
    ).and_return(
      status: 500
    ).and_return(
      body: { data: [{ url: 'https://example.com/cloud.jpg' }] }.to_json,
      status: 200
    )

    assert_enqueued_jobs(1, only: SignpostJob) do
      click_button('Create')

      assert_selector('h1', text: 'My Deck')
    end

    ImageGeneration.stub_const(:MODIFICATION_KEYWORDS, ['with sunglasses']) do
      assert_raises(ImageGeneration::Error) do
        perform_enqueued_jobs
      end
    end

    assert_requested(stubbed_response)

    page.refresh

    assert_enqueued_jobs(1, only: SignpostJob) do
      within('#cards') do
        within(:xpath, './li[1]') do
          assert_text('What is a cloud?')
          assert_text('Image failed')

          find_button('Retry Attachment').click
        end
      end

      page.refresh

      find('#cards')
    end

    ImageGeneration.stub_const(:MODIFICATION_KEYWORDS, ['with sunglasses']) do
      assert_raises(ImageGeneration::Error) do
        perform_enqueued_jobs
      end
    end

    assert_requested(stubbed_response, times: 2)

    stub_request(:get, 'https://example.com/cloud.jpg').and_return(
      body: File.new('test/fixtures/files/cloud.jpg'), status: 200
    )

    assert_enqueued_jobs(1, only: SignpostJob) do
      within('#cards') do
        within(:xpath, './li[1]') do
          assert_text('What is a cloud?')
          assert_text('Image failed')

          find_button('Retry Attachment').click
        end
      end

      page.refresh

      find('#cards')
    end

    ImageGeneration.stub_const(:MODIFICATION_KEYWORDS, ['with sunglasses']) do
      perform_enqueued_jobs
    end

    assert_requested(stubbed_response, times: 3)

    page.refresh

    within('#cards') do
      within(:xpath, './li[1]') do
        assert_text('What is a cloud?')
        assert_text('Image success')

        assert_no_button('Retry Attachment')
      end
    end
  end

  test 'prevents creation of empty cards' do
    visit root_path

    login_as(email: 'freddie@queen.com', password: 'password')

    click_link('Add New Card')

    assert_selector('label', text: 'Front Text')

    click_button('Next')

    assert_selector('label', text: 'Front Text')
  end

  test 'sanitizes dangerous input' do
    visit root_path

    login_as(email: 'freddie@queen.com', password: 'password')

    click_link('Add New Card')

    fill_in('Front Text', with: "Hello <script>alert('hacked in script tag');</script>")
    click_button('Next')

    fill_in('Back Text', with: '<img src="" onerror="alert(\'hacked in img error\');">')
    click_button('Create')

    # Implicitly tests no alert - Selenium would throw UnexpectedAlertOpenError
  end
end
