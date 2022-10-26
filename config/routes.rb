Rails.application.routes.draw do
  root "decks#show"

  resource "deck", only: [:show] do
    resource "cards", only: [:new, :create, :destroy] do
      get "new_2", to: "cards#new_2"
    end

    get "test", to: "decks#test"
  end
end
