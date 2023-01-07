# frozen_string_literal: true

require 'net/http'
require 'open-uri'

class SignpostService
  attr_reader :image_generation_client, :prompt_builder, :card, :signpost

  def initialize(image_generation_client:, prompt_builder:, card:)
    @image_generation_client = image_generation_client
    @prompt_builder = prompt_builder
    @card = card
    @signpost = card.signpost
  end

  def build_and_attach_image
    image_url = build_image_url

    open_and_attach_image(image_url)

    signpost.success!
  rescue StandardError => e
    signpost.failed!
    raise e
  end

  private

  def build_image_url
    prompt = prompt_builder.build(card.full_text)

    image_generation_client.generated_image_url(prompt)
  end

  def open_and_attach_image(image_url)
    image = URI.parse(image_url).open
    filename = image_url.split('/').last

    signpost.attach(io: image, filename:)
    Rails.logger.info "Image attached for Card #{card.id} with filename #{filename}"
  end
end
