# frozen_string_literal: true

class AddCards < ActiveRecord::Migration[7.0]
  def change
    create_table :cards do |t|
      t.text :front_text, null: false
      t.text :back_text, null: false

      t.belongs_to :account, index: true, null: false

      t.timestamps
    end
  end
end
