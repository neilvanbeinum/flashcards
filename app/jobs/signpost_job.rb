class SignpostJob < ApplicationJob
  queue_as :default

  def perform(card)
    SignpostService.new(card).build_and_attach_image
  end
end
