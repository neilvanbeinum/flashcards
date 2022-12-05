class DecksController < ApplicationController
  def show
    @cards = current_account.cards

    respond_to do |format|
      format.html
      format.json { render json: card_attributes_with_signposts(@cards) }
    end
  end

  private

  def card_attributes_with_signposts(cards)
    cards.map do |card|
      image_attributes = card.signpost.attached? ? { "signpost_url" => url_for(card.signpost.image) } : {}

      { **card.attributes, **image_attributes }
    end
  end
end
