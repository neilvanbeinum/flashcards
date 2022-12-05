class SignpostsController < ApplicationController
  def create
    card = Card.find(params[:card_id])

    SignpostJob.perform_later(card) if card.signpost.failed?

    redirect_to deck_path
  end
end
