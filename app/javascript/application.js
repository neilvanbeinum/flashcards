import "@hotwired/turbo-rails"

import Card from "card"

let testCards = []
let currentTestCard

let cardToCreate = {}

const displayCards = () => {
  document.querySelector("#add-new-card").addEventListener("click", () => {
    cardToCreate = {}
  })

  document.querySelector("#start-test").addEventListener("click", () => {
    Turbo.visit("/deck/test")
  })
}

const flipCurrentCard = () => {
  currentTestCard.flip()
}

const displayNextCard = () => {
  const flipCardButton = document.querySelector("#flip-card")
  const testContainer = document.querySelector("#test-container")

  flipCardButton.removeEventListener("click", flipCurrentCard)

  currentTestCard = new CardTestPresenter(testContainer, testCards.shift())

  flipCardButton.addEventListener("click", flipCurrentCard)

  currentTestCard.displayCurrentFace()

  if (testCards.length === 0) {
    const nextCardButton = document.querySelector("#next-card")

    nextCardButton.removeEventListener("click", displayNextCard)
    nextCardButton.innerText = "End Test"
    nextCardButton.addEventListener("click", () => Turbo.visit("/deck"))
  }
}

class CardTestPresenter {
  constructor(cardElement, card) {
    this.cardElement = cardElement
    this.card = card
    this.frontIsCurrentFace = true
  }

  flip() {
    this.frontIsCurrentFace = !this.frontIsCurrentFace

    this.displayCurrentFace()
  }

  displayCurrentFace() {
    const elements = this.frontIsCurrentFace
      ? this.frontHTML()
      : this.backHTML()

    this.cardElement.innerHTML = null

    elements.forEach((elem) => this.cardElement.appendChild(elem))
  }

  frontHTML() {
    const p = document.createElement("p")
    p.innerText = this.card.frontText

    return [p]
  }

  backHTML() {
    const p = document.createElement("p")
    p.innerText = this.card.backText

    if (this.hasImage()) {
      const image = document.createElement("img")
      image.setAttribute("src", this.imageUrl())

      return [image, p]
    } else {
      return [document.createElement("div"), p]
    }
  }

  hasImage() {
    return !!this.card.signpostUrl
  }

  imageUrl() {
    return this.card.signpostUrl
  }
}

const renderStepOne = (cardForm) => {
  document.querySelector("#front_text").value = cardToCreate.frontText || ""

  cardForm.addEventListener("turbo:submit-start", (e) => {
    e.detail.formSubmission.stop()

    const form = document.querySelector("form")
    const data = new FormData(form)

    cardToCreate = {
      ...cardToCreate,
      frontText: data.get("front_text"),
    }

    Turbo.visit("/deck/cards/new_2")
  })
}

const renderStepTwo = () => {
  document.querySelector("#card_front_text").value = cardToCreate.frontText
}

const renderTest = async () => {
  const cardsJSON = await fetchCards()

  testCards = cardsJSON.map((cardJSON) => new Card(cardJSON))

  document
    .querySelector("#next-card")
    .addEventListener("click", displayNextCard)

  displayNextCard()
}

const fetchCards = async () => {
  try {
    const response = await fetch("/deck.json")

    return await response.json()
  } catch (error) {
    console.error(`Could not fetch cards - ${error}`)
  }
}

document.addEventListener("turbo:load", () => {
  const cardList = document.querySelector("#cards")

  if (cardList) {
    displayCards()
  }

  const cardForm = document.querySelector("#new-card-form")

  if (cardForm) {
    renderStepOne(cardForm)
  }

  const cardNew2Form = document.querySelector("#new-2-card-form")

  if (cardNew2Form) {
    renderStepTwo()
  }

  const testContainer = document.querySelector("#test-container")

  if (testContainer) {
    renderTest()
  }
})
