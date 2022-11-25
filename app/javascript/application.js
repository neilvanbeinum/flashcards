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

const displayCardText = (text) => {
  document.querySelector("#test-container").innerHTML = text
}

const shiftAndDisplayNextCard = () => {
  currentTestCard = new CardTestPresenter(testCards.shift())
  displayCardText(currentTestCard.nextFaceText())

  if (testCards.length === 0) {
    const nextCardButton = document.querySelector("#next-card")

    nextCardButton.removeEventListener("click", shiftAndDisplayNextCard)

    nextCardButton.innerText = "End Test"

    nextCardButton.setAttribute("variant", "success")

    nextCardButton.addEventListener("click", () => Turbo.visit("/deck"))
  }
}

const flipCurrentTestCard = () => {
  displayCardText(currentTestCard.nextFaceText())
}

class CardTestPresenter {
  constructor(card) {
    this.card = card
    this.frontIsCurrentFace = true
  }

  nextFaceText() {
    const text = this.frontIsCurrentFace
      ? this.card.frontText
      : this.card.backText

    this.frontIsCurrentFace = !this.frontIsCurrentFace

    return text
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

const renderTest = () => {
  fetch("/deck.json")
    .then((response) => response.json())
    .then((json) => {
      testCards = json.map((cardJSON) => new Card(cardJSON))

      document
        .querySelector("#flip-card")
        .addEventListener("click", flipCurrentTestCard)

      document
        .querySelector("#next-card")
        .addEventListener("click", shiftAndDisplayNextCard)

      shiftAndDisplayNextCard()
    })
    .catch((e) => console.error(`Could not fetch cards - ${e}`))
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
