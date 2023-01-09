# frozen_string_literal: true

class Card < ApplicationRecord
  belongs_to :deck
  has_one :signpost, dependent: :destroy

  validates :front_text, presence: true
  validates :back_text, presence: true

  after_create proc { |record| record.create_signpost! }

  def full_text
    [front_text, back_text].join(' ')
  end
end
