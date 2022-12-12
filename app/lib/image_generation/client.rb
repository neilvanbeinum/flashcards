module ImageGeneration
  class Client
    def generated_image_url(prompt)
      begin
        response = request_image(prompt)
      rescue Faraday::Error => error
        raise ImageGeneration::Error, "Error calling API #{ [error.response[:status], error.response[:body]].join(" ") }"
      end

      response_body = JSON.parse(response.body)

      raise ImageGeneration::Error, "Error calling API: #{ response_body["error"]["message"] }" if response_body["error"]

      JSON.parse(response.body)["data"][0]["url"]
    end

    private

    def connection
      @_connection ||= Faraday.new(url: ENV['IMAGE_GENERATOR_API_URL']) do |faraday|
        faraday.response :raise_error
      end
    end

    def request_image(prompt)
      connection.post do |req|
        req.headers['Authorization'] = "Bearer #{ ENV["IMAGE_GENERATOR_API_KEY"] }"
        req.headers['Content-Type'] = "application/json"

        req.body = body(prompt)
      end
    end

    def body(prompt)
      {
        prompt: prompt,
        n: 1,
        size: "256x256"
      }.to_json
    end
  end
end
