# frozen_string_literal: true

class DecksChannel < ApplicationCable::Channel
  def subscribed
    deck = Deck.find_by!(account: current_account, id: params[:id])

    stream_for deck
  end

  def unsubscribed; end
end
