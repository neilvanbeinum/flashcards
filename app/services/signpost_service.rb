require 'net/http'
require 'open-uri'

class SignpostService
  attr_reader :image_generation_client, :prompt_builder, :card

  def initialize(image_generation_client:, prompt_builder:, card:)
    @image_generation_client = image_generation_client
    @prompt_builder = prompt_builder
    @card = card
  end

  def build_and_attach_image
    begin
      prompt = prompt_builder.extract_keywords(card.full_text)

      image_url = image_generation_client.generated_image_url(prompt)

      image = URI.open(image_url)

      filename = image_url.split("/").last
      card.signpost.attach(io: image, filename: filename)

      Rails.logger.info "Image attached for Card #{ card.id } with filename #{ filename }"

      card.signpost.success!
    rescue StandardError => error
      card.signpost.failed!
      raise error
    end
  end
end
