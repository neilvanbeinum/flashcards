# frozen_string_literal: true

class Signpost < ApplicationRecord
  belongs_to :card
  has_one :deck, through: :card

  enum :status, %i[pending success failed]

  has_one_attached :image
  delegate_missing_to :image

  after_commit do |signpost|
    DecksChannel.broadcast_to(deck, signpost) if saved_change_to_attribute?(:status)
  end
end
