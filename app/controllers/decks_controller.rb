# frozen_string_literal: true

class DecksController < ApplicationController
  def show
    @deck = current_account.deck

    respond_to do |format|
      format.html
      format.json { render json: card_attributes_with_signposts(@deck.cards) }
    end
  end

  def test
    @card_count = current_account.deck.cards.length
  end

  private

  def card_attributes_with_signposts(cards)
    cards.map do |card|
      image_attributes = card.signpost.attached? ? { 'signpost_url' => url_for(card.signpost.image) } : {}

      { **card.attributes, **image_attributes }
    end
  end
end
