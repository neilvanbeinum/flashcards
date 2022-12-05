require 'net/http'
require 'open-uri'

class SignpostService
  class ImageGenerationError < StandardError; end

  def initialize(card)
    @card = card
  end

  def build_and_attach_image
    begin
      image_url = ImageGenerationClient.new.generated_image_url([@card.front_text, @card.back_text].join(" "))
      Rails.logger.info "Image generated for Card #{ @card.id } at #{ image_url }"

      image = URI.open(image_url)
      Rails.logger.info "Image opened for Card #{ @card.id } at #{ image_url }"

      filename = image_url.split("/").last
      @card.signpost.attach(io: image, filename: filename)
      Rails.logger.info "Image attached for Card #{ @card.id } with filename #{ filename }"

      @card.signpost.success!
    rescue StandardError => error
      @card.signpost.failed!
      raise ImageGenerationError, "Could not generate or attach image: #{ error.message }"
    end
  end
end

class ImageGenerationClient
  def generated_image_url(prompt_text)

    begin
      response = connection.post do |req|
        req.headers['Authorization'] = "Bearer #{ ENV["IMAGE_GENERATOR_API_KEY"] }"
        req.headers['Content-Type'] = "application/json"
        req.body = {
          prompt: prompt_text,
          n: 1,
          size: "256x256"
        }.to_json
      end
    rescue Faraday::Error => error
      raise "Error connecting to API: #{ [error.response[:status], error.response[:body]].join(" ") }"
    end

    response_body = JSON.parse(response.body)

    if response_body["error"]
      raise "Error connecting to API: #{ response_body["error"]["message"] }"
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
