class SignpostJob < ApplicationJob
  queue_as :default

  def perform(card)
    SignpostService.new(
      image_generation_client: ImageGeneration::Client.new,
      prompt_builder: ImageGeneration::PromptBuilder.new,
      card: card
    ).build_and_attach_image
  end
end
