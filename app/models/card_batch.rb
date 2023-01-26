# frozen_string_literal: true

require 'csv'

class CardBatch
  class Error < StandardError; end

  MAX_ROWS = 10

  attr_reader :errors, :cards

  def initialize(deck, csv_file)
    @deck = deck
    @csv_file = csv_file
    @errors = []
    @cards = []
  end

  def save_cards
    raise Error, 'Empty file' if File.empty? @csv_file

    ActiveRecord::Base.transaction do
      @cards = build_cards_from_csv(@csv_file).each(&:save!)
    end

    @cards.each { |card| SignpostJob.perform_later(card) }

    true
  rescue ActiveRecord::RecordInvalid, CSV::MalformedCSVError, Error => e
    @errors = e.instance_of?(Error) ? [e.message] : ['File contains one or more invalid rows']
    false
  end

  private

  def build_cards_from_csv(csv_file)
    [].tap do |cards|
      CSV.foreach(csv_file).with_index do |row, index|
        raise Error, "File is too large (over #{MAX_ROWS} lines)" if index == MAX_ROWS - 1

        cards << build_card(row)
      end
    end
  end

  def build_card(row)
    @deck.cards.new(front_text: row[0]&.strip, back_text: row[1]&.strip)
  end
end
