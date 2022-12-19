# frozen_string_literal: true

class CardsController < ApplicationController
  def new; end

  def new_two; end

  def create
    @card = current_account.cards.new(card_params)

    if @card.save
      SignpostJob.perform_later(@card)
      redirect_to deck_path
    else
      flash.now[:alert] = 'Cannot create card with missing fields'
      render :new_two
    end
  end

  def destroy
    @card = Card.find(params[:id])

    flash.now[:alert] = 'Cannot delete card' unless @card.destroy

    redirect_to deck_path
  end

  private

  def card_params
    params.require(:card).permit(:front_text, :back_text)
  end
end
