import "@hotwired/turbo-rails"

import DOMPurify from "dompurify"
import Card from "card"

let testCards = []
let currentTestCard

let cardToCreate = {}

const toggleStartButtonEnabled = (isOn) => {
  document.querySelector("#start-test").disabled = !isOn
}

const displayCards = (cardsDOMList) => {
  const cardFragments = Card.all().map((card) => {
    const fragment = document
      .createRange()
      .createContextualFragment(
        `<li><div>${DOMPurify.sanitize(card.frontText)} - ${DOMPurify.sanitize(
          card.backText
        )}</div><div><button class="delete-card">Delete</button></div></li>`
      )

    fragment
      .querySelector("button.delete-card")
      .addEventListener("click", () => {
        card.delete()
        displayCards(cardsDOMList)
      })

    return fragment
  })

  cardsDOMList.innerHTML = ""
  cardsDOMList.append(...cardFragments)

  toggleStartButtonEnabled(Card.all().length > 0)

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

const renderStepTwo = (cardForm) => {
  document.querySelector("#back_text").value = cardToCreate.backText || ""

  cardForm.addEventListener("turbo:submit-start", (e) => {
    e.detail.formSubmission.stop()

    const form = document.querySelector("form")
    const data = new FormData(form)

    cardToCreate = {
      ...cardToCreate,
      backText: data.get("back_text"),
    }

    try {
      const card = new Card({ ...cardToCreate })

      card.save()

      Turbo.visit("/deck")
    } catch (error) {
      console.error(`Unable to create card: ${error}`)
    }
  })
}

const renderTest = () => {
  testCards = structuredClone(Card.all())

  document
    .querySelector("#flip-card")
    .addEventListener("click", flipCurrentTestCard)

  document
    .querySelector("#next-card")
    .addEventListener("click", shiftAndDisplayNextCard)

  shiftAndDisplayNextCard()
}

document.addEventListener("turbo:load", () => {
  const cardsDOMList = document.querySelector("#cards")

  if (cardsDOMList) {
    displayCards(cardsDOMList)
  }

  const cardForm = document.querySelector("#new-card-form")

  if (cardForm) {
    renderStepOne(cardForm)
  }

  const cardNew2Form = document.querySelector("#new-2-card-form")

  if (cardNew2Form) {
    renderStepTwo(cardNew2Form)
  }

  const testContainer = document.querySelector("#test-container")

  if (testContainer) {
    renderTest()
  }
})
