module ImageGeneration
  class Client
    def generated_image_url(prompt)
      begin
        response = connection.post do |req|
          req.headers['Authorization'] = "Bearer #{ ENV["IMAGE_GENERATOR_API_KEY"] }"
          req.headers['Content-Type'] = "application/json"
          req.body = {
            prompt: prompt,
            n: 1,
            size: "256x256"
          }.to_json
        end
      rescue Faraday::Error => error
        raise "Error calling API #{ [error.response[:status], error.response[:body]].join(" ") }"
      end

      response_body = JSON.parse(response.body)

      if response_body["error"]
        raise "Error calling API: #{ response_body["error"]["message"] }"
      else
        JSON.parse(response.body)["data"][0]["url"]
      end
    end

    private

    def connection
      @_connection ||= Faraday.new(url: ENV['IMAGE_GENERATOR_API_URL']) do |faraday|
        faraday.response :raise_error
      end
    end
  end
end
