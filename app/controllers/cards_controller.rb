# frozen_string_literal: true

class CardsController < ApplicationController
  def new; end

  def create
    @card = current_account.cards.new(card_params)

    if @card.save
      SignpostJob.perform_later(@card)
      redirect_to deck_path
    else
      flash[:alert] = 'Cannot create card with missing fields'
      redirect_to new_deck_card_path
    end
  end

  def destroy
    @card = Card.find(params[:id])

    flash[:alert] = 'Cannot delete card' unless @card.destroy

    redirect_to deck_path
  end

  private

  def card_params
    params.require(:card).permit(:front_text, :back_text)
  end
end
