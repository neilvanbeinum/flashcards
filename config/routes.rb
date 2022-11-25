Rails.application.routes.draw do
  root "decks#show"

  resource "deck", only: [:show] do
    resources "cards", only: [:new, :create, :destroy]
    get "cards/new_2", to: "cards#new_2"

    get "test", to: "decks#test"
  end
end
