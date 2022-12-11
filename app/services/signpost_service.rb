require 'net/http'
require 'open-uri'

class SignpostService
  attr_reader :image_generation_client, :card

  def initialize(image_generation_client:, card:)
    @image_generation_client = image_generation_client
    @card = card
  end

  def build_and_attach_image
    begin
      prompt = [card.front_text, card.back_text].join(" ")

      image_url = image_generation_client.generated_image_url(prompt)
      Rails.logger.info "Image generated for Card #{ card.id } at #{ image_url }"

      image = URI.open(image_url)
      Rails.logger.info "Image opened for Card #{ card.id } at #{ image_url }"

      filename = image_url.split("/").last
      card.signpost.attach(io: image, filename: filename)
      Rails.logger.info "Image attached for Card #{ card.id } with filename #{ filename }"

      card.signpost.success!
    rescue StandardError => error
      card.signpost.failed!
      raise ImageGeneration::Error, "Could not generate or attach image: #{ error.message }"
    end
  end
end
