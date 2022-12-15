# frozen_string_literal: true

require 'test_helper'
require 'minitest/mock'

class SignpostServiceTest < ActiveSupport::TestCase
  test 'it calls the client to generate an image with a prompt, opens it, and attaches it to the card' do
    card = cards(:card_one)

    mock_prompt_builder = Minitest::Mock.new
    mock_prompt_builder.expect(:build, 'front_text', ['front_text_one back_text_one'])

    mock_client = Minitest::Mock.new
    mock_client.expect(
      :generated_image_url,
      'https://example.com/cloud.jpg',
      ['front_text']
    )

    image_request = stub_request(:get, 'https://example.com/cloud.jpg').and_return(
      body: File.new('test/fixtures/files/cloud.jpg'), status: 200
    )

    SignpostService.new(
      image_generation_client: mock_client,
      prompt_builder: mock_prompt_builder,
      card:
    ).build_and_attach_image

    mock_client.verify
    mock_prompt_builder.verify
    assert_requested(image_request)

    card.reload

    assert card.signpost.attached?
    assert_equal 'cloud.jpg', card.signpost.filename.to_s
    assert_equal 'success', card.signpost.status
  end

  test 'it sets the signpost status to failed when image generation fails' do
    card = cards(:card_one)

    mock_client = Object.new
    def mock_client.generated_image_url(_prompt)
      raise
    end

    mock_prompt_builder = Object.new
    def mock_prompt_builder.extract_keywords
      raise
    end

    assert_raises(StandardError) do
      SignpostService.new(
        image_generation_client: mock_client,
        prompt_builder: mock_prompt_builder,
        card:
      ).build_and_attach_image
    end

    assert_equal 'failed', card.reload.signpost.status
  end
end
