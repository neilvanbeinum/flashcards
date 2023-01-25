# frozen_string_literal: true

class CardBatchesController < ApplicationController
  def new; end

  def create
    @card_batch = CardBatch.new(current_account.deck, file)

    if @card_batch.save_cards
      flash[:notice] = "#{@card_batch.cards.length} cards created"
      redirect_to deck_path
    else
      flash[:alert] = I18n.t('card_batches.errors.create')
      render :new, status: :unprocessable_entity
    end
  end

  private

  def file
    params.require(:csv_file)
  end
end
