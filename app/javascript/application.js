import "@hotwired/turbo-rails"
import { setupTest } from "test"

let cardToCreate = {}

const displayCards = () => {
  document.querySelector("#add-new-card").addEventListener("click", () => {
    cardToCreate = {}
  })

  document.querySelector("#start-test").addEventListener("click", () => {
    Turbo.visit("/deck/test")
  })
}

const setupStepOne = (cardForm) => {
  document.querySelector("#front_text").value = cardToCreate.frontText || ""

  cardForm.addEventListener("turbo:submit-start", (e) => {
    e.detail.formSubmission.stop()

    const form = document.querySelector("form")
    const data = new FormData(form)

    cardToCreate = {
      ...cardToCreate,
      frontText: data.get("front_text"),
    }

    Turbo.visit("/deck/cards/new_two")
  })
}

const setupStepTwo = () => {
  document.querySelector("#card_front_text").value = cardToCreate.frontText
}

document.addEventListener("turbo:load", () => {
  const cardList = document.querySelector("#cards")

  if (cardList) {
    displayCards()
  }

  const cardForm = document.querySelector("#new-card-form")

  if (cardForm) {
    setupStepOne(cardForm)
  }

  const cardNew2Form = document.querySelector("#new-2-card-form")

  if (cardNew2Form) {
    setupStepTwo()
  }

  const testContainer = document.querySelector("#test-container")

  if (testContainer) {
    setupTest()
  }
})
