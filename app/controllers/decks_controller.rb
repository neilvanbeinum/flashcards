class DecksController < ApplicationController
  def show
    @cards = current_account.cards

    respond_to do |format|
      format.html
      format.json { render json: @cards }
    end
  end
end
