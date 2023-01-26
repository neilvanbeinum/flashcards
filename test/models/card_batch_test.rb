# frozen_string_literal: true

require 'test_helper'

class CardBatchTest < ActiveSupport::TestCase
  setup do
    @deck = decks(:one)
    @tempfile = Tempfile.new
  end

  teardown do
    @tempfile.unlink
  end

  test '#save_cards with an empty file does not create any Cards' do
    @card_batch = CardBatch.new(@deck, @tempfile)
    assert_not @card_batch.save_cards

    assert_empty @card_batch.cards
    assert_equal ['Empty file'], @card_batch.errors
  end

  test '#save_cards with an incomplete data file does not create any Cards' do
    @tempfile.write <<~CSV
      front_text1,\t
      front_text2,back_text2
    CSV

    @tempfile.rewind

    @card_batch = CardBatch.new(@deck, @tempfile)
    assert_not @card_batch.save_cards

    assert_empty @card_batch.cards
    assert_equal ['File contains one or more invalid rows'], @card_batch.errors
  end

  test '#save_cards with a data file longer than the limit does not create any Cards' do
    stub_max_lines = 1

    @tempfile.write <<~CSV
      front_text1,back_text_2
      front_text2,back_text2
    CSV

    @tempfile.rewind

    CardBatch.stub_const(:MAX_ROWS, stub_max_lines) do
      @card_batch = CardBatch.new(@deck, @tempfile)
      assert_not @card_batch.save_cards
    end

    assert_empty @card_batch.cards
    assert_equal ['File is too large (over 1 lines)'], @card_batch.errors
  end

  test '#save_cards with a valid data file creates Cards' do
    @tempfile.write <<~CSV
      front_text1,    back_text1
      front_text2,back_text2
    CSV

    @tempfile.rewind

    @card_batch = CardBatch.new(@deck, @tempfile)
    assert @card_batch.save_cards

    assert_empty @card_batch.errors

    assert_equal 2, @card_batch.cards.count

    first_card = @card_batch.cards[0]
    assert_equal 'front_text1', first_card.front_text
    assert_equal 'back_text1', first_card.back_text

    second_card = @card_batch.cards[1]
    assert_equal 'front_text2', second_card.front_text
    assert_equal 'back_text2', second_card.back_text

    assert(@card_batch.cards.all?(&:persisted?))
  end
end
