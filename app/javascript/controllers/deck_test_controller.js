import { Controller } from "@hotwired/stimulus"

import { Card, CardTestPresenter } from "card"

export default class extends Controller {
  static targets = ["testContainer", "showNextCardButton"]

  async connect() {
    const cardsJSON = await this.fetchCards()

    this.testCards = cardsJSON.map((cardJSON) => new Card(cardJSON))
    this.currentCardIndex = 0

    this.currentCard = new CardTestPresenter(
      this.testCards[this.currentCardIndex]
    )

    this.currentCard.displayCurrentFace(this.testContainerTarget)
  }

  onClickShowNextCard(e) {
    if (this.currentCardIndex === this.testCards.length - 1) {
      Turbo.visit("/deck")
      return
    }

    this.currentCardIndex += 1

    if (this.currentCardIndex === this.testCards.length - 1) {
      e.target.innerText = "End Test"
    }

    this.currentCard = new CardTestPresenter(
      this.testCards[this.currentCardIndex]
    )
    this.currentCard.displayCurrentFace(this.testContainerTarget)
  }

  flipCard() {
    this.currentCard.flip(this.testContainerTarget)
  }

  async fetchCards() {
    try {
      const response = await fetch("/deck.json")

      return await response.json()
    } catch (error) {
      console.error(`Could not fetch cards - ${error}`)
    }
  }
}
