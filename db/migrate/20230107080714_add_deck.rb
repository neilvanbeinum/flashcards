# frozen_string_literal: true

class AddDeck < ActiveRecord::Migration[7.0]
  class TemporaryAccount < ApplicationRecord
    self.table_name = 'accounts'

    has_many :temporary_cards, foreign_key: 'account_id'
    has_one :temporary_deck, foreign_key: 'account_id'
  end

  class TemporaryCard < ApplicationRecord
    self.table_name = 'cards'

    belongs_to :temporary_account, foreign_key: 'account_id'
    belongs_to :temporary_deck, foreign_key: 'deck_id'
  end

  class TemporaryDeck < ApplicationRecord
    self.table_name = 'decks'

    belongs_to :temporary_account, foreign_key: 'account_id'
    has_many :temporary_cards, foreign_key: 'deck_id'
  end

  def up
    create_table :decks do |t|
      t.belongs_to :account, index: true, null: false

      t.timestamps
    end

    add_belongs_to :cards, :deck, index: true

    TemporaryAccount.all.each do |account|
      # create a deck for every account
      deck = account.create_temporary_deck!

      # add all their cards to their deck
      deck.update!(temporary_cards: account.temporary_cards)
    end

    # add not null constraint to cards deck ref
    change_column_null :cards, :deck_id, false

    # remove reference cards user
    remove_belongs_to :cards, :account
  end

  def down
    add_belongs_to :cards, :account, index: true

    TemporaryAccount.all.each do |account|
      account.update!(temporary_cards: account.temporary_deck.temporary_cards)
    end

    change_column_null :cards, :account_id, false

    remove_belongs_to :cards, :deck

    drop_table :decks
  end
end
