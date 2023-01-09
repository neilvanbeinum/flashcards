# frozen_string_literal: true

class Deck < ApplicationRecord
  belongs_to :account
  has_many :cards, dependent: :destroy
end
