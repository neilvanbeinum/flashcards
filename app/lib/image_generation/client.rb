# frozen_string_literal: true

module ImageGeneration
  class Client
    def generated_image_url(prompt)
      response = request_image(prompt)

      response_body = JSON.parse(response.body)

      if response_body['error']
        raise ImageGeneration::Error,
              "Error calling API: #{response_body['error']['message']}"
      end

      response_body['data'][0]['url']
    end

    private

    def connection
      @connection ||= Faraday.new(url: ENV.fetch('IMAGE_GENERATOR_API_URL')) do |faraday|
        faraday.response :raise_error
      end
    end

    def request_image(prompt)
      connection.post do |req|
        req.headers['Authorization'] = "Bearer #{ENV.fetch('IMAGE_GENERATOR_API_KEY')}"
        req.headers['Content-Type'] = 'application/json'

        req.body = body(prompt)
      end
    rescue Faraday::Error => e
      raise ImageGeneration::Error,
            "Error calling API #{[e.response[:status], e.response[:body]].join(' ')}"
    end

    def body(prompt)
      {
        prompt:,
        n: 1,
        size: '256x256'
      }.to_json
    end
  end
end
