require "test_helper"

class SignpostServiceTest < ActiveSupport::TestCase
  test "it generates an image and attaches it to the card" do
    card = cards(:card_one)

    image_generation_request = stub_request(:post, ENV["IMAGE_GENERATOR_API_URL"]).with(
      body: (
        {
          prompt: 'front_text_one back_text_one',
          n: 1,
          size: "256x256"
        }
      )
    ).and_return(
      body: {
          data: [
            { url: 'https://example.com/cloud.jpg' }
          ]
      }.to_json,
      status: 200
    )

    image_request = stub_request(:get, 'https://example.com/cloud.jpg').and_return(
      body: File.new('test/fixtures/files/cloud.jpg'), status: 200
    )

    SignpostService.new(card).build_and_attach_image

    assert_requested(image_generation_request)
    assert_requested(image_request)

    card.reload

    assert card.signpost.attached?
    assert_equal "cloud.jpg", card.signpost.filename.to_s
    assert_equal "success", card.signpost.status
  end
end
