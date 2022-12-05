class AddSignpost < ActiveRecord::Migration[7.0]
  def up
    create_table :signposts do |t|
      t.references :card, foreign_key: true
      t.integer :status, null: false, default: 0
      t.timestamps
    end

    ActiveRecord::Base.transaction do
      Card.all.each do |card|
        attachment = ActiveStorage::Attachment.find_by(record_id: card.id)

        next unless attachment

        signpost = Signpost.create!(card: card)

        attachment.update!(record_id: signpost.id, record_type: "Signpost", name: "image")
      end
    end
  end

  def down
    ActiveRecord::Base.transaction do
      Card.all.each do |card|
        attachment = ActiveStorage::Attachment.find_by(record_id: card.signpost.id)

        next unless attachment

        attachment.update!(record_id: card.id, record_type: "Card", name: "signpost")
      end
    end

    drop_table :signposts
  end
end
