class Card < ApplicationRecord
  belongs_to :account
  has_one :signpost, dependent: :destroy

  validates :front_text, presence: true
  validates :back_text, presence: true

  after_create proc { |record| record.create_signpost! }
end
