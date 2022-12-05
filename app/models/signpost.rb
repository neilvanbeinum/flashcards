class Signpost < ApplicationRecord
  belongs_to :card
  enum :status, [:pending, :success, :failed]

  has_one_attached :image
  delegate_missing_to :image
end
