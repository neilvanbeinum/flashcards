# frozen_string_literal: true

class Signpost < ApplicationRecord
  belongs_to :card
  enum :status, %i[pending success failed]

  has_one_attached :image
  delegate_missing_to :image
end
