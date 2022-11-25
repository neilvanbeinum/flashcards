class Card < ApplicationRecord
  belongs_to :account

  validates :front_text, presence: true
  validates :back_text, presence: true
end
