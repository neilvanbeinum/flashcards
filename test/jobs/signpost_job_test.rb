require 'test_helper'
require 'minitest/mock'

class SignpostJobTest < ActiveJob::TestCase
  test 'it calls the SignpostService#build_and_attach_image method with the supplied card' do
    expected_card = cards(:card_one)

    mock_signpost_instance = Minitest::Mock.new
    mock_signpost_instance.expect(:build_and_attach_image, nil)

    mock_service_instantiation = Proc.new do |image_generation_client:, card:|
      assert_equal card, expected_card
      assert_equal ImageGeneration::Client, image_generation_client.class

      mock_signpost_instance
    end

    SignpostService.stub :new, mock_service_instantiation do
      SignpostJob.perform_now(expected_card)
    end

    mock_signpost_instance.verify
  end
end
