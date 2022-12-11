class SignpostJob < ApplicationJob
  queue_as :default

  def perform(card)
    SignpostService.new(
      image_generation_client: ImageGeneration::Client.new,
      card: card
    ).build_and_attach_image
  end
end
