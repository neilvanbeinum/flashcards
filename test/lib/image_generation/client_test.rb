# frozen_string_literal: true

require 'test_helper'

class ImageGenerationClientTest < ActiveSupport::TestCase
  test 'it calls the API with expected configuration and returns the url on a successful response' do
    stub_request(:post, ENV.fetch('IMAGE_GENERATOR_API_URL')).with(
      body:
        {
          prompt: 'cool beans',
          n: 1,
          size: '256x256'
        }
    ).and_return(
      body: {
        data: [
          { url: 'some_url' }
        ]
      }.to_json,
      status: 200
    )

    assert_equal 'some_url', ImageGeneration::Client.new.generated_image_url('cool beans')
  end

  test 'it raises when the API responds with a 4XX error' do
    stub_request(:post, ENV.fetch('IMAGE_GENERATOR_API_URL')).and_return(status: 401)

    assert_raises do
      ImageGeneration::Client.new.generated_image_url('')
    end
  end

  test 'it raises when a response contains an error field' do
    stub_request(:post, ENV.fetch('IMAGE_GENERATOR_API_URL')).and_return(
      body: {
        error: {
          message: 'Gone bad'
        }
      }.to_json,
      status: 200
    )

    assert_raises do
      ImageGeneration::Client.new.generated_image_url('')
    end
  end
end
