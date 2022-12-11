require "test_helper"
require 'minitest/mock'

class SignpostServiceTest < ActiveSupport::TestCase
  test "it calls the client to generate an image, opens it, and attaches it to the card" do
    card = cards(:card_one)

    mock_client = Minitest::Mock.new
    mock_client.expect(
      :generated_image_url,
      "https://example.com/cloud.jpg",
      ["front_text_one back_text_one"]
    )

    image_request = stub_request(:get, 'https://example.com/cloud.jpg').and_return(
      body: File.new('test/fixtures/files/cloud.jpg'), status: 200
    )

    SignpostService.new(
      image_generation_client: mock_client,
      card: card
    ).build_and_attach_image

    mock_client.verify
    assert_requested(image_request)

    card.reload

    assert card.signpost.attached?
    assert_equal "cloud.jpg", card.signpost.filename.to_s
    assert_equal "success", card.signpost.status
  end

  test "it sets the signpost status to failed when image generation fails" do
    card = cards(:card_one)

    mock_client = Object.new
    def mock_client.build_and_attach_image
      raise
    end

    assert_raises(ImageGeneration::Error) do
      SignpostService.new(image_generation_client: mock_client, card: card).build_and_attach_image
    end

    assert_equal "failed", card.reload.signpost.status
  end
end
