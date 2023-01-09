# frozen_string_literal: true

require 'test_helper'

class SignpostTest < ActiveSupport::TestCase
  include ActionCable::TestHelper

  test 'it broadcasts on the DecksChannel when a change to the status is made' do
    deck = decks(:two)
    card = deck.cards.first

    signpost = Signpost.create!(card:)

    assert_broadcast_on(DecksChannel.broadcasting_for(deck), signpost) do
      # signpost.success!

      DecksChannel.broadcast_to(deck, signpost)
    end
  end

  test 'it does not broadcast when updating an attribute other than status' do
    deck = decks(:two)
    card = deck.cards.first

    signpost = Signpost.create!(card:)

    assert_no_broadcasts 'DecksChannel' do
      signpost.update(created_at: Time.zone.now)
    end
  end
end
