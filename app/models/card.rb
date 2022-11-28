class Card < ApplicationRecord
  belongs_to :account
  has_one_attached :signpost

  validates :front_text, presence: true
  validates :back_text, presence: true
end
